import { Document } from 'bson'
import { Rental } from '../../domain/Types/Rental'

export default class RentalMapper {
  public static fromDocument(document: Document): Rental {
    return {
      id: document._id.toString(),
      client: document.client,
      vehicle: document.vehicle,
      startDate: document.startDate,
      endDate: document.endDate,
    }
  }
}
