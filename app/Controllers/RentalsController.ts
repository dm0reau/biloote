import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Rental } from '../../domain/types/rental'
import { VehicleType } from '../../domain/types/vehicle'
import ClientsRepository from '../Repositories/ClientsRepository'
import RentalsRepository from '../Repositories/RentalsRepository'
import VehiclesRepository from '../Repositories/VehiclesRepository'

export default class RentalController {
  public clientsRepository: ClientsRepository
  public vehiclesRepository: VehiclesRepository
  public rentalsRepository: RentalsRepository

  constructor() {
    this.clientsRepository = new ClientsRepository()
    this.vehiclesRepository = new VehiclesRepository()
    this.rentalsRepository = new RentalsRepository()
  }

  public async show(ctx: HttpContextContract) {
    const vehicleType: VehicleType = ctx.params.vehicleType

    if (!this.isAllowedVehicleType(vehicleType)) {
      return ctx.response.notFound()
    }

    const clients = await this.clientsRepository.getClients()
    const vehicles = await this.vehiclesRepository.getByVehicleType(vehicleType)

    return ctx.view.render('rental', {
      vehicleTypeName: this.getVehicleTypeName(vehicleType),
      vehicleType,
      vehicles,
      clients,
    })
  }

  public async new(ctx: HttpContextContract) {
    const vehicleType: VehicleType = ctx.params.vehicleType

    if (!this.isAllowedVehicleType(vehicleType)) {
      return ctx.response.notFound()
    }

    const body = ctx.request.body()
    const client = await this.clientsRepository.getById(body.clientId)
    const vehicle = await this.vehiclesRepository.getById(body.vehicleId)

    if (!client || !vehicle) {
      return ctx.response.notFound()
    }

    const startDate = new Date(body.startDate)
    const endDate = new Date(body.endDate)

    const rental: Rental = {
      client,
      vehicle,
      startDate,
      endDate,
    }

    await this.rentalsRepository.create(rental)
    return ctx.response.send({ rental })
  }

  private getVehicleTypeName(vehicleType: VehicleType): string {
    switch (vehicleType) {
      case VehicleType.BICYCLE:
        return 'vélo électrique'
      case VehicleType.MOTORBIKE:
        return 'moto électrique'
      case VehicleType.SCOOTER:
        return 'scooter électrique'
    }
  }

  private isAllowedVehicleType(vehicleType: VehicleType): boolean {
    return (
      vehicleType === VehicleType.BICYCLE ||
      vehicleType === VehicleType.MOTORBIKE ||
      vehicleType === VehicleType.SCOOTER
    )
  }
}