import React from "react";

const CertificationCard = ({ certification, onEdit, onDelete, formatDate }) => {
    return (
        <div className="certification-card">
            <div className="certification-header">
                <h5>{certification.title}</h5>
                <div className="certification-actions">
                    <button 
                        className="edit-btn" 
                        onClick={onEdit}
                        title="Editar"
                    >
                        <i className="fa fa-edit"></i>
                    </button>
                    <button 
                        className="delete-btn" 
                        onClick={onDelete}
                        title="Eliminar"
                    >
                        <i className="fa fa-trash"></i>
                    </button>
                </div>
            </div>
            <div className="certification-details">
                <p><strong>Entidad:</strong> {certification.issued_by}</p>
                <p><strong>Emitido:</strong> {formatDate(certification.issued_date)}</p>
                <p><strong>Válido hasta:</strong> {formatDate(certification.valid_until)}</p>
                {certification.certification_number && (
                    <p><strong>Número:</strong> {certification.certification_number}</p>
                )}
                {certification.document_url && (
                    <p>
                        <strong>Documento:</strong>
                        <a href={certification.document_url} target="_blank" rel="noopener noreferrer">
                            Ver certificado
                        </a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default CertificationCard;