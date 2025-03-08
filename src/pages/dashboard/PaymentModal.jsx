import React, { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "../../styles/PaymentModal.css";
const PaymentModal = ({ show, onClose, trip, userId }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);
    const [paymentVoucherUrl, setPaymentVoucherUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Convertir total_cost a número de forma segura
    const totalCost = Number(trip.total_cost || 0).toFixed(2);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_FILE_SIZE) {
                setError('El archivo es demasiado grande. Máximo 5MB.');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            setIsUploading(true);
            setFileName(file.name);
            setError('');

            try {
                const response = await fetch('https://rangerhub-back.vercel.app/upload/voucher', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    setPaymentVoucherUrl(data.fileUrl);
                } else {
                    throw new Error(data.error || 'Error al subir el archivo');
                }
            } catch (error) {
                console.error('Error uploading file:', error);
                setError(error.message);
                setFileName('');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setError('');

        if (!paymentMethod) {
            setError('Selecciona un método de pago');
            return;
        }

        if (!paymentVoucherUrl) {
            setError('Sube un comprobante de pago');
            return;
        }

        try {
            const response = await fetch('https://rangerhub-back.vercel.app/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    trip_id: trip.id,
                    payment_amount: totalCost,
                    payment_method: paymentMethod,
                    payment_voucher_url: paymentVoucherUrl,
                    payment_date: new Date().toISOString().split('T')[0]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar el pago');
            }

            alert('Pago iniciado correctamente');
            onClose();
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>Pagar Viaje: {trip.trip_name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmitPayment}>
                    <Form.Group className="mb-3">
                        <Form.Label>Monto a Pagar</Form.Label>
                        <div className="form-control bg-light" style={{cursor: 'default', height: "45px"}}>
                            ${totalCost}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Método de Pago</Form.Label>
                        <Form.Select 
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar método de pago</option>
                            <option value="tarjeta_credito">Tarjeta de Crédito</option>
                            <option value="tarjeta_debito">Tarjeta de Débito</option>
                            <option value="transferencia">Transferencia Bancaria</option>
                            <option value="paypal">PayPal</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Comprobante de Pago</Form.Label>
                        <div className="custom-file-upload">
                            <input
                                type="file"
                                id="customFile"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                accept=".pdf,.jpg,.jpeg,.png,.gif"
                                className="custom-file-input"
                                disabled={isUploading}
                            />
                            <label 
                                htmlFor="customFile" 
                                className="custom-file-label btn btn-outline-primary w-100"
                            >
                                {fileName || 'Seleccionar archivo'}
                            </label>
                        </div>
                        {isUploading && (
                            <div className="text-muted mt-2">Subiendo archivo...</div>
                        )}
                        {paymentVoucherUrl && (
                            <div className="text-success mt-2">
                                Archivo subido: {fileName}
                            </div>
                        )}
                    </Form.Group>

                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="btn-primary w-100 mt-3"
                        disabled={isUploading}
                    >
                        {isUploading ? 'Procesando...' : 'Confirmar Pago'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentModal;