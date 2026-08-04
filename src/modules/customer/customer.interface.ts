export interface UpdateCustomerProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  profilePhoto?: string;
}
export interface CreateBookingPayload {
  serviceId: string;
  scheduledStart: string;
  scheduledEnd: string;
  note?: string;
}
