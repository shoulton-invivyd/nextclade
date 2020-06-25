import type { DeepReadonly } from 'ts-essentials'
import type { Tagged } from 'src/helpers/types'

/** Type-safe representation of a nucleotide */
export type Nucleotide = Tagged<string, 'Nucleotide'>

/** Type-safe representation of an aminoacid */
export type Aminoacid = Tagged<string, 'Aminoacid'>

/** Represents a numeric interval bounded by start and end. Similar to `Span`, but different representation. */
export interface Range {
  begin: number
  end: number
}

/** Represents a numeric interval bounded by start and length. Similar to `Range`, but different representation. */
export interface Span {
  start: number
  length: number
}

export interface NucleotideLocation {
  pos: number
  nuc: Nucleotide
}

export interface NucleotideSubstitution {
  pos: number
  refNuc: Nucleotide
  queryNuc: Nucleotide
}

export type NucleotideDeletion = Tagged<Span, 'NucleotideDeletion'>

export interface Substitutions {
  [key: string]: DeepReadonly<NucleotideLocation[]>
}

export interface AminoacidSubstitution {
  refAA: Aminoacid
  queryAA: Aminoacid
  codon: number
  gene: string
}

export interface SubstitutionsWithAminoacids extends NucleotideSubstitution {
  aaSubstitutions: DeepReadonly<AminoacidSubstitution[]>
}

export interface SubstringMatch {
  character: Nucleotide
  range: Range
}

export interface QCParameters {
  knownClusters: Set<number>
  windowSize: number
  clusterCutOff: number
  divergenceThreshold: number
  mixedSitesThreshold: number
  missingDataThreshold: number
}

export interface Virus {
  QCParams: QCParameters
  clades: DeepReadonly<Substitutions>
}

export interface ClusteredSNPs {
  start: number
  end: number
  numberOfSNPs: number
}

export interface QCDiagnostics {
  totalNumberOfMutations: number
  totalMixedSites: number
  clusteredSNPs: ClusteredSNPs[]
}

export interface QCResult {
  flags: string[]
  diagnostics: QCDiagnostics
  nucleotideComposition: Record<string, number>
}

export interface AnalysisResult {
  seqName: string
  clades: DeepReadonly<Substitutions>
  substitutions: DeepReadonly<SubstitutionsWithAminoacids[]>
  insertions: DeepReadonly<NucleotideLocation[]>
  deletions: DeepReadonly<NucleotideDeletion[]>
  missing: DeepReadonly<SubstringMatch[]>
  alignmentStart: number
  alignmentEnd: number
  alignmentScore: number
  diagnostics: DeepReadonly<QCResult>
}

export interface AnalysisParams {
  seqName: string
  seq: string
  rootSeq: string
}

/** Represents a named interval in the genome */
export interface Gene {
  name: string
  color: string
  range: Range
}

export interface MutationElement extends SubstitutionsWithAminoacids {
  seqName: string
}

export interface MutationElementWithId extends MutationElement {
  id: string
}

export interface MissingElement {
  seqName: string
  character: Nucleotide
  begin: number
  end: number
}

export interface MissingElementWithId extends MissingElement {
  id: string
}
