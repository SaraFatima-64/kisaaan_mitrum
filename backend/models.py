from sqlalchemy import Column, Integer, String, DateTime  # type: ignore
from database import Base
from datetime import datetime, timezone


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    activity_type = Column(String, index=True)
    description = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class WeatherAlert(Base):
    __tablename__ = "weather_alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    severity = Column(String)  # e.g., High, Medium, Low
    description = Column(String)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class RoverBooking(Base):
    __tablename__ = "rover_bookings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_name = Column(String)
    date = Column(String)
    status = Column(String, default="Pending")  # Pending, Confirmed, Completed
