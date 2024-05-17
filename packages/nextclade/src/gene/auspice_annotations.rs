use crate::coord::range::{NucRefGlobalRange, Range};
use crate::features::feature::Landmark;
use crate::gene::cds::{split_circular_cds_segments, Cds};
use crate::gene::cds_segment::{CdsSegment, WrappingPart};
use crate::gene::frame::Frame;
use crate::gene::gene::Gene;
use crate::gene::phase::Phase;
use crate::io::json::{json_stringify, JsonPretty};
use crate::tree::tree::{AuspiceGenomeAnnotationCds, AuspiceGenomeAnnotations, Segments, StartEnd};
use eyre::Report;
use maplit::hashmap;
use std::collections::HashMap;

pub fn convert_auspice_annotations_to_genes(anns: &AuspiceGenomeAnnotations) -> Result<Vec<Gene>, Report> {
  let landmark = Landmark {
    index: 0,
    id: "landmark".to_owned(),
    name: "landmark".to_owned(),
    range: NucRefGlobalRange::from_isize(anns.nuc.start.saturating_sub(1), anns.nuc.end),
    strand: anns.nuc.strand,
    is_circular: true,
  };

  anns
    .cdses
    .iter()
    .enumerate()
    .map(|(index, (cds_name, ann))| {
      let gene_name = ann.gene.as_ref().unwrap_or(cds_name);

      let segments = match &ann.segments {
        Segments::OneSegment(segment) => convert_cds_segments(ann, &landmark, cds_name, &[segment.to_owned()]),
        Segments::MultipleSegments { segments } => convert_cds_segments(ann, &landmark, cds_name, segments),
      }?;

      let cds = Cds {
        id: cds_name.to_owned(),
        name: cds_name.to_owned(),
        product: cds_name.to_owned(),
        segments,
        proteins: vec![],
        exceptions: vec![],
        attributes: HashMap::default(),
        compat_is_gene: true,
        color: ann.color.clone(),
      };

      Ok(Gene {
        index,
        id: gene_name.to_owned(),
        name: gene_name.to_owned(),
        cdses: vec![cds],
        exceptions: vec![],
        attributes: HashMap::default(),
        source_record: None,
        compat_is_cds: true,
        color: ann.color.clone(),
      })
    })
    .collect()
}

fn convert_cds_segments(
  ann: &AuspiceGenomeAnnotationCds,
  landmark: &Landmark,
  cds_name: &str,
  ann_segments: &[StartEnd],
) -> Result<Vec<CdsSegment>, Report> {
  let mut begin = 0;
  let mut segments = vec![];

  for (index, &StartEnd { start, end }) in ann_segments.iter().enumerate() {
    let name = format!("{cds_name}_fragment_{index}");

    let range = NucRefGlobalRange::from_isize(start.saturating_sub(1), end);
    let range_local = Range::from_usize(begin, begin + range.len());
    let phase = Phase::from_begin(range_local.begin)?;
    let frame = Frame::from_begin(range.begin)?;

    segments.push(CdsSegment {
      index,
      id: name.clone(),
      name,
      range: range.clone(),
      range_local,
      landmark: Some(landmark.to_owned()),
      wrapping_part: WrappingPart::NonWrapping,
      strand: ann.strand,
      frame,
      phase,
      exceptions: vec![],
      attributes: hashmap! {},
      source_record: Some(json_stringify(ann, JsonPretty(true))?),
      compat_is_gene: false,
      color: ann.color.clone(),
    });

    begin += range.len();
  }

  let segments = split_circular_cds_segments(&segments)?;

  Ok(segments)
}
