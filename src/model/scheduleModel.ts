export interface ScheduleModel {
  Id: string,
  BookingTime: string,
  IsDirty: boolean,
  BookingStatus: number,
  BookingStatusName: string,
  ServiceUserId: string,
  LocationAddress: string,
  ServiceName: string
}
