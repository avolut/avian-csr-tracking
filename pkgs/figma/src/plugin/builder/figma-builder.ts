import { convertSingleNodeToAlt } from '../altNodes/altConversion'
import {
  AltBlendMixin,
  AltDefaultShapeMixin,
  AltFrameMixin,
  AltFrameNode,
  AltGeometryMixin,
  AltSceneNode,
  AltTextNode,
} from '../altNodes/altMixins'
import {
  commonLetterSpacing,
  commonLineHeight,
} from '../common/commonTextHeightSpacing'
import { parentCoordinates } from '../common/parentCoordinates'
import { formatWithJSX } from '../common/parseJSX'
import {
  tailwindOpacity,
  tailwindRotation,
  tailwindVisibility,
} from './builderImpl/tailwindBlend'
import {
  tailwindBorderRadius,
  tailwindBorderWidth,
} from './builderImpl/tailwindBorder'
import {
  tailwindColorFromFills,
  tailwindGradientFromFills,
} from './builderImpl/tailwindColor'
import { tailwindPadding } from './builderImpl/tailwindPadding'
import { tailwindPosition } from './builderImpl/tailwindPosition'
import { tailwindShadow } from './builderImpl/tailwindShadow'
import { htmlSizePartialForTailwind } from './builderImpl/tailwindSize'
import {
  pxToFontSize,
  pxToLayoutSize,
  pxToLetterSpacing,
  pxToLineHeight,
} from './conversionTables'

export const buildTwClassStyle = (
  node: BaseNode
): { class: string; style: string } => {
  try {
    return new TwBuilder(node).build()
  } catch (e) {
    console.warn(e)
    return {
      class: '',
      style: '',
    }
  }
}

class TwBuilder {
  className: string = ''
  visible = true
  style: string = ''
  hasFixedSize = false
  altNode: AltSceneNode
  node: BaseNode
  isJSX: true
  constructor(node: BaseNode) {
    this.node = node
    this.altNode = convertSingleNodeToAlt(node as SceneNode)
  }

  blend(node: AltSceneNode | AltTextNode): this {
    this.className += tailwindVisibility(node)
    this.className += tailwindRotation(node)
    this.className += tailwindOpacity(node)

    return this
  }

  border(node: AltGeometryMixin & AltSceneNode): this {
    this.className += tailwindBorderWidth(node)
    this.className += tailwindBorderRadius(node)
    this.customColor(node.strokes, 'border')

    return this
  }

  position(
    node: AltSceneNode,
    parentId: string,
    isRelative: boolean = false
  ): this {
    const position = tailwindPosition(node, parentId, this.hasFixedSize)

    if (node.overflow === 'VERTICAL') {
      this.className += 'relative overflow-y-auto '
    }

    if (position === 'absoluteManualLayout' && node.parent) {
      // tailwind can't deal with absolute layouts.

      const [parentX, parentY] = parentCoordinates(node.parent)

      const left = node.x - parentX
      const top = node.y - parentY

      this.style += formatWithJSX('left', this.isJSX, left)
      this.style += formatWithJSX('top', this.isJSX, top)

      if (!isRelative) {
        this.className += 'absolute '
      }
    } else {
      this.className += position
    }

    return this
  }

  /**
   * https://tailwindcss.com/docs/text-color/
   * example: text-blue-500
   * example: text-opacity-25
   * example: bg-blue-500
   */
  customColor(
    paint: ReadonlyArray<Paint> | PluginAPI['mixed'],
    kind: string
  ): this {
    // visible is true or undefinied (tests)
    if (this.visible !== false) {
      let gradient = ''
      if (kind === 'bg') {
        gradient = tailwindGradientFromFills(paint)
      }
      if (gradient) {
        this.className += gradient
      } else {
        this.className += tailwindColorFromFills(paint, kind)
      }
    }
    return this
  }

  /**
   * https://tailwindcss.com/docs/box-shadow/
   * example: shadow
   */
  shadow(node: AltBlendMixin): this {
    this.className += tailwindShadow(node)
    return this
  }

  // must be called before Position, because of the hasFixedSize attribute.
  widthHeight(node: AltSceneNode): this {
    const [htmlWidth, htmlHeight] = htmlSizePartialForTailwind(node, this.isJSX)

    if (node.css.inherit.height) {
      this.style += `${htmlHeight} `
    }
    if (node.css.inherit.width) {
      this.style += `${htmlWidth} `
    }
    return this
  }

  autoLayoutPadding(node: AltFrameMixin | AltDefaultShapeMixin): this {
    this.className += tailwindPadding(node)
    return this
  }

  removeTrailingSpace(): this {
    if (this.className.length > 0 && this.className.slice(-1) === ' ') {
      this.className = this.className.slice(0, -1)
    }

    if (this.style.length > 0 && this.style.slice(-1) === ' ') {
      this.style = this.style.slice(0, -1)
    }
    return this
  }

  autoLayoutFlex(node: AltFrameNode): this {
    // [optimization]
    // flex, by default, has flex-row. Therefore, it can be omitted.
    const rowOrColumn = node.layoutMode === 'HORIZONTAL' ? '' : 'flex-col '

    // https://tailwindcss.com/docs/space/
    // space between items
    const spacing = node.itemSpacing > 0 ? pxToLayoutSize(node.itemSpacing) : 0
    const spaceDirection = node.layoutMode === 'HORIZONTAL' ? 'x' : 'y'

    // space is visually ignored when there is only one child or spacing is zero
    const space =
      node.children.length > 1 &&
      spacing > 0 &&
      node.primaryAxisAlignItems !== 'SPACE_BETWEEN'
        ? `space-${spaceDirection}-${spacing} `
        : ''

    let primaryAlign: string
    switch (node.primaryAxisAlignItems) {
      case 'MIN':
        primaryAlign = 'justify-start '
        break
      case 'CENTER':
        primaryAlign = 'justify-center '
        break
      case 'MAX':
        primaryAlign = 'justify-end '
        break
      case 'SPACE_BETWEEN':
        primaryAlign = 'justify-between '
        break
    }

    // [optimization]
    // when all children are STRETCH and layout is Vertical, align won't matter. Otherwise, center it.
    let counterAlign: string
    switch (node.counterAxisAlignItems) {
      case 'MIN':
        counterAlign = 'items-start '
        break
      case 'CENTER':
        counterAlign = 'items-center '
        break
      case 'MAX':
        counterAlign = 'items-end '
        break
    }

    let flex = 'flex '
    if (node.layoutGrow) {
      flex += 'flex-1 '
    }

    if (node.layoutAlign === 'STRETCH') {
      flex += 'self-stretch '
    }

    this.className +=
      `${flex}${rowOrColumn}${space}${counterAlign}${primaryAlign}`.replace(
        /undefined/gi,
        ''
      )

    return this
  }
  // must be called before Position method
  textAutoSize(node: AltTextNode): this {
    if (node.textAutoResize === 'NONE') {
      // going to be used for position
      this.hasFixedSize = true
    }

    this.widthHeight(node)

    return this
  }

  // todo fontFamily
  //  fontFamily(node: AltTextNode): this {
  //    return this;
  //  }

  /**
   * https://tailwindcss.com/docs/font-size/
   * example: text-md
   */
  fontSize(node: AltTextNode): this {
    // example: text-md
    if (node.fontSize !== figma.mixed) {
      const value = pxToFontSize(node.fontSize)
      this.className += `text-${value} `
    }

    return this
  }

  /**
   * https://tailwindcss.com/docs/font-style/
   * example: font-extrabold
   * example: italic
   */
  fontStyle(node: AltTextNode): this {
    if (node.fontName !== figma.mixed && node.fontName.style) {
      const lowercaseStyle = node.fontName.style.toLowerCase()

      if (lowercaseStyle.match('italic')) {
        this.className += 'italic '
      }

      if (lowercaseStyle.match('regular')) {
        // ignore the font-style when regular (default)
        return this
      }

      const value = node.fontName.style
        .replace('italic', '')
        .replace(' ', '')
        .toLowerCase()

      this.className += `font-${value} `
    }
    return this
  }

  /**
   * https://tailwindcss.com/docs/letter-spacing/
   * example: tracking-widest
   */
  letterSpacing(node: AltTextNode): this {
    const letterSpacing = commonLetterSpacing(node)
    if (letterSpacing > 0) {
      const value = pxToLetterSpacing(letterSpacing)
      this.className += `tracking-${value} `
    }

    return this
  }

  /**
   * https://tailwindcss.com/docs/line-height/
   * example: leading-3
   */
  lineHeight(node: AltTextNode): this {
    const lineHeight = commonLineHeight(node)
    if (lineHeight > 0) {
      const value = pxToLineHeight(lineHeight)
      this.className += `leading-${value} `
    }

    return this
  }

  /**
   * https://tailwindcss.com/docs/text-align/
   * example: text-justify
   */
  textAlign(node: AltTextNode): this {
    // if alignHorizontal is LEFT, don't do anything because that is native

    // only undefined in testing
    if (node.textAlignHorizontal && node.textAlignHorizontal !== 'LEFT') {
      // todo when node.textAutoResize === "WIDTH_AND_HEIGHT" and there is no \n in the text, this can be ignored.
      switch (node.textAlignHorizontal) {
        case 'CENTER':
          this.className += `text-center `
          break
        case 'RIGHT':
          this.className += `text-right `
          break
        case 'JUSTIFIED':
          this.className += `text-justify `
          break
      }
    }

    return this
  }

  /**
   * https://tailwindcss.com/docs/text-transform/
   * example: uppercase
   */
  textTransform(node: AltTextNode): this {
    if (node.textCase === 'LOWER') {
      this.className += 'lowercase '
    } else if (node.textCase === 'TITLE') {
      this.className += 'capitalize '
    } else if (node.textCase === 'UPPER') {
      this.className += 'uppercase '
    } else if (node.textCase === 'ORIGINAL') {
      // default, ignore
    }

    return this
  }

  /**
   * https://tailwindcss.com/docs/text-decoration/
   * example: underline
   */
  textDecoration(node: AltTextNode): this {
    if (node.textDecoration === 'UNDERLINE') {
      this.className += 'underline '
    } else if (node.textDecoration === 'STRIKETHROUGH') {
      this.className += 'line-through '
    }

    return this
  }

  reset(): void {
    this.className = ''
  }

  build(): { class: string; style: string; name: string } {
    this.className = this.className.replace(/undefined/gi, '')
    this.removeTrailingSpace()
    if (!this.altNode) {
      return {
        class: this.className,
        style: this.style,
        name: this.node.getPluginData('tagName') || 'div',
      }
    }

    switch (this.altNode.type) {
      case 'FRAME':
        {
          const node = this.altNode
          this.autoLayoutFlex(node)
            .blend(node)
            .widthHeight(node)
            .autoLayoutPadding(node)
            .position(node, node.parent?.id, true)
            .customColor(node.fills, 'bg')
            .shadow(node)
            .border(node)
        }
        break
      case 'TEXT':
        {
          const node = this.altNode
          this.blend(node)
            .textAutoSize(node)
            .position(node, node.parent?.id)
            .fontSize(node)
            .fontStyle(node)
            .letterSpacing(node)
            .lineHeight(node)
            .textDecoration(node)
            .textAlign(node)
            .customColor(node.fills, 'text')
            .textTransform(node)
        }
        break
    }

    return {
      class: this.className,
      style: this.style,
      name: this.node.getPluginData('tagName') || 'div',
    }
  }
}
