import babelTraverse from '@babel/traverse'
import babelParser from '@babel/parser'
import babelCore from '@babel/core'
import babelGenerator from '@babel/generator'

export const transformAsync = babelCore.transformAsync
export const types = babelCore.types
export const transformFileAsync = babelCore.transformFileAsync
export const template = babelCore.template
export const parse = babelParser.parse
export const traverse = babelTraverse.default || babelTraverse
export const generate = babelGenerator.default || babelGenerator
