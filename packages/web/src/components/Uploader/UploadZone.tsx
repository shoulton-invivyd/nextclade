import React from 'react'

import { DropEvent, FileRejection, useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { MdFileUpload } from 'react-icons/md'
import { Col, Row } from 'reactstrap'

export interface UploadZoneProps {
  onDrop<T extends File>(acceptedFiles: T[], fileRejections: FileRejection[], event: DropEvent): void
}

export function UploadZone({ onDrop }: UploadZoneProps) {
  const { t } = useTranslation()
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: false })

  const activeClass = isDragActive ? 'upload-zone-active' : ''

  return (
    <div {...getRootProps()} className="upload-zone">
      <input type="file" {...getInputProps()} />

      <div className={`upload-zone ${activeClass}`}>
        <Row noGutters>
          <Col className="d-flex w-100">
            <MdFileUpload className="upload-icon mx-auto" size={50} />
          </Col>
        </Row>
        <Row noGutters>
          <Col>
            <p className="text-center">{t('Drag and drop a file')}</p>
            <p className="text-center">{t('-or-')}</p>
            <p className="text-center">{t('Click to select a file')}</p>
          </Col>
        </Row>
      </div>
    </div>
  )
}
