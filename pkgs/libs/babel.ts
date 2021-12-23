import babelGenerator from '@babel/generator'
import * as btNode from '@babel/traverse'
export * from '@babel/core'
export { parse } from '@babel/parser'

export type NodePath<T = btNode.Node> = btNode.NodePath<T>
export const traverse = btNode.default
export const generate = babelGenerator
