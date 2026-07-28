import os
from pathlib import Path
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv

auth_env_path = Path(__file__).parent.parent.parent / "saarthi-auth" / ".env"
load_dotenv(dotenv_path=auth_env_path)
load_dotenv()

# Map the saarthi-auth email variables to what we need
SMTP_EMAIL = os.getenv("EMAIL_USER") or os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("EMAIL_PASS") or os.getenv("SMTP_PASSWORD")
SMTP_SERVER = os.getenv("EMAIL_HOST") or os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("EMAIL_PORT") or os.getenv("SMTP_PORT", 587))
EMAIL_FROM = os.getenv("EMAIL_FROM") or SMTP_EMAIL


def send_appointment_confirmation(user_email: str, appointment_date: str, mode: str):
    """
    Sends an email confirmation for the booked appointment.
    """
    if not SMTP_EMAIL or not SMTP_PASSWORD:
        print("Warning: SMTP credentials missing. Skipping email confirmation.")
        return False
        
    try:
        msg = EmailMessage()
        msg['Subject'] = 'Your GynoConnect Appointment is Confirmed!'
        msg['From'] = EMAIL_FROM
        msg['To'] = user_email
        
        body = f"""
        Hello,
        
        Your appointment on GynoConnect has been successfully booked!
        
        Details:
        - Date & Time: {appointment_date}
        - Mode: {mode}
        
        Thank you for choosing GynoConnect.
        """
        msg.set_content(body)
        
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
            
        print(f"Confirmation email sent to {c}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False
