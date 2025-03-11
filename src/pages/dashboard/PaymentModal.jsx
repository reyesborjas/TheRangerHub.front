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
            // Format the date as YYYY-MM-DD for PostgreSQL date type
            const formattedPaymentDate = new Date().toISOString().split('T')[0];

            const paymentData = {
                user_id: userId,
                trip_id: trip.id,
                payment_amount: parseFloat(totalCost), // Ensure decimal with two places
                payment_method: paymentMethod,
                payment_voucher_url: paymentVoucherUrl,
                payment_date: formattedPaymentDate
            };

            console.log('Sending payment data:', paymentData);
            console.log('Data types:', {
                user_id: typeof userId,
                trip_id: typeof trip.id,
                payment_amount: typeof paymentData.payment_amount,
                payment_method: typeof paymentMethod,
                payment_voucher_url: typeof paymentVoucherUrl,
                payment_date: typeof formattedPaymentDate
            });

            const response = await fetch('https://rangerhub-back.vercel.app/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData)
            });

            // Log the raw response for debugging
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                // Throw an error with the backend's error message
                throw new Error(data.error || 'Error al procesar el pago');
            }

            alert('Pago iniciado correctamente');
            onClose();
        } catch (error) {
            console.error('Full error details:', error);
            console.error('Error type:', typeof error);
            console.error('Error object:', error);
            console.error('Error properties:', Object.keys(error));
            
            // Mapeo de errores comunes para mensajes más amigables
            const errorMessages = {
                'Usuario no encontrado': 'No se encontró el usuario. Por favor, inicie sesión nuevamente.',
                'Viaje no encontrado': 'El viaje seleccionado no existe o ha sido eliminado.',
                'Datos de pago incompletos': 'Por favor, complete todos los campos requeridos.',
                'Monto de pago inválido': 'El monto del pago no es válido.',
                'Ya existe un pago para esta reserva': 'Ya has realizado un pago para este viaje.',
                'Error de base de datos': 'Hubo un problema con la base de datos. Intente nuevamente más tarde.'
            };

            // Buscar un mensaje de error personalizado o usar el mensaje original
            const friendlyErrorMessage = Object.keys(errorMessages).find(key => 
                error.message.includes(key)
            );

            setError(
                friendlyErrorMessage 
                    ? errorMessages[friendlyErrorMessage] 
                    : 'Ocurrió un error al procesar su pago. Por favor, intente nuevamente.'
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