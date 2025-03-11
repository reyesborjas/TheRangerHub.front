import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import "../../styles/PaymentModal.css";

const PaymentModal = ({ show, onClose, trip, userId }) => {
    const [paymentMethod, setPaymentMethod] = useState('');
    const [error, setError] = useState('');
    const [paymentVoucherUrl, setPaymentVoucherUrl] = useState('');

    // Convertir total_cost a número decimal con dos decimales
    const totalCost = Number(trip.total_cost || 0).toFixed(2);

    const handleSubmitPayment = async (e) => {
        e.preventDefault();
        setError('');
    
        // Validaciones iniciales
        if (!paymentMethod) {
            setError('Selecciona un método de pago');
            return;
        }
    
        if (!paymentVoucherUrl) {
            setError('Ingresa la URL del comprobante de pago');
            return;
        }
    
        // Validate URL format
        const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        
        if (!urlPattern.test(paymentVoucherUrl)) {
            setError('Por favor, ingresa una URL válida');
            return;
        }
    
        try {
            // Formato de fecha para PostgreSQL
            const formattedPaymentDate = new Date().toISOString().split('T')[0];
    
            const paymentData = {
                user_id: userId,
                trip_id: trip.id,
                payment_amount: parseFloat(totalCost), // Decimal con dos lugares
                payment_method: paymentMethod,
                payment_voucher_url: paymentVoucherUrl,
                payment_date: formattedPaymentDate // Incluir fecha
            };
    
            console.log('Sending payment data:', JSON.stringify(paymentData, null, 2));
    
            const response = await fetch('https://rangerhub-back.vercel.app/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.error || 'Error al procesar el pago');
            }
    
            alert('Pago iniciado correctamente');
            onClose();
        } catch (error) {
            console.error('Error details:', error);
            
            const errorMessages = {
                'El comprobante de pago ya ha sido registrado': 'Este comprobante de pago ya ha sido utilizado.',
                'Datos de pago incompletos': 'Por favor, complete todos los campos requeridos.',
                'Usuario no encontrado': 'No se encontró el usuario.',
                'Viaje no encontrado': 'El viaje no existe.'
            };
    
            setError(
                errorMessages[error.message] || 
                'Ocurrió un error al procesar su pago. Por favor, intente nuevamente.'
            );
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
                        <Form.Label>URL Comprobante de Pago</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Ingrese la URL del comprobante de pago"
                            value={paymentVoucherUrl}
                            onChange={(e) => setPaymentVoucherUrl(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}

                    <Button 
                        type="submit" 
                        className="btn-primary w-100 mt-3"
                    >
                        Confirmar Pago
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default PaymentModal;