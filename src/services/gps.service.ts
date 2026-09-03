import { prisma } from '@/lib/db/prisma';
import { GpsDeviceStatus } from '@prisma/client';

// Geofence center (Bangkok Metropolitan Center) & Allowed Radius (e.g. 80km)
const GEOFENCE_CENTER = { lat: 13.7563, lng: 100.5018 };
const GEOFENCE_MAX_RADIUS_KM = 80;

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export class GpsService {
  static async getFleetStatus() {
    const devices = await prisma.gpsDevice.findMany({
      include: {
        vehicle: {
          include: {
            bookings: {
              where: { status: 'ACTIVE' },
              include: { customer: true },
              take: 1,
            },
          },
        },
        logs: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
    });

    return devices.map((d: any) => {
      const latestLog = d.logs[0] || null;
      const isOut = latestLog ? latestLog.isOutOfZone : false;
      const activeBooking = d.vehicle.bookings[0] || null;

      return {
        id: d.id,
        deviceSerial: d.deviceSerial,
        batteryLevel: d.batteryLevel,
        status: isOut ? 'ALERT' : d.status,
        lastSeenAt: d.lastSeenAt,
        vehicle: {
          id: d.vehicle.id,
          brand: d.vehicle.brand,
          model: d.vehicle.model,
          licensePlate: d.vehicle.licensePlate,
          imageUrl: d.vehicle.imageUrl,
          status: d.vehicle.status,
        },
        currentRenter: activeBooking
          ? {
              name: `${activeBooking.customer.firstName} ${activeBooking.customer.lastName}`,
              phone: activeBooking.customer.phone,
              bookingNumber: activeBooking.bookingNumber,
            }
          : null,
        latestLocation: latestLog
          ? {
              latitude: latestLog.latitude,
              longitude: latestLog.longitude,
              speed: latestLog.speed,
              heading: latestLog.heading,
              isOutOfZone: latestLog.isOutOfZone,
              recordedAt: latestLog.recordedAt,
            }
          : null,
      };
    });
  }

  static async recordGpsLog(deviceId: string, lat: number, lng: number, speed: number, heading: number = 0) {
    const distance = calculateDistanceKm(lat, lng, GEOFENCE_CENTER.lat, GEOFENCE_CENTER.lng);
    const isOutOfZone = distance > GEOFENCE_MAX_RADIUS_KM;

    const log = await prisma.gpsLog.create({
      data: {
        deviceId,
        latitude: lat,
        longitude: lng,
        speed,
        heading,
        isOutOfZone,
        recordedAt: new Date(),
      },
    });

    await prisma.gpsDevice.update({
      where: { id: deviceId },
      data: {
        lastSeenAt: new Date(),
        status: isOutOfZone ? GpsDeviceStatus.ALERT : GpsDeviceStatus.ACTIVE,
      },
    });

    return log;
  }
}
