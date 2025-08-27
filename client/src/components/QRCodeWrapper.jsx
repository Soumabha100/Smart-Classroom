import React from 'react';
import QRCode from 'react-qr-code';

// This component simply takes the props and passes them to the actual QR Code library.
// This acts as a stable "middleman" for the import.
const QRCodeWrapper = (props) => {
  return <QRCode {...props} />;
};

export default QRCodeWrapper;