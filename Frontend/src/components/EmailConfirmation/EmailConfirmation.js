import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function EmailConfirmation() {
  const navigate = useNavigate();
console.log("test")
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

console.log("Retrieved token:", token);

    if (token) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/User/confirm-email?token=${token}`)
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => {
              console.error("Error status:", response.status, "Error message:", text);
              
              if (response.status === 400 && text.includes("Email is already verified")) {
                navigate('/prijava?message=AlreadyVerified', { state: { fromConfirmation: true, message: 'Email is already verified!' } });
                throw new Error('Already verified');
              }
              
              throw new Error('Network response was not ok');
            });
          }
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then(data => {
          if (typeof data === 'string') {
            console.log("Server response (text):", data);
            
            if (data.includes("Email confirmed successfully")) {
                navigate('/prijava?message=EmailConfirmed', { state: { fromConfirmation: true, message: 'Email confirmed successfully!' } });
              return;
            }
          }
        })
        .catch(error => {
          console.error("There was an error with email confirmation:", error);
        });
    } else {
      alert("Token is missing!");
      navigate('/prijava');
    }
  }, [navigate]);

}

export default EmailConfirmation;
