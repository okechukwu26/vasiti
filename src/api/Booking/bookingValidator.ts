import joi from '@hapi/joi'
import {BookingType,BOOK} from '../../enums'


export const createBookingSchema = joi.object().keys({
    tripId:joi.string().uuid().required(),
    returnTripId:joi.string().uuid().optional(),
    travelDate:joi.string().optional(),
    type:joi.string().valid(BookingType.ONE_WAY, BookingType.ROUND_TRIP).required(),
    service:joi.string().valid(BOOK.BOOK_A_SEAT, BOOK.HIRE_SERVICE).required(),
    numberOfTravellers:joi.number().required(),
    seat:joi.array().items(joi.string().optional()),
    returnSeat:joi.array().items(joi.string().optional()),
    referenceId:joi.string().required(),
    returnDate:joi.string().optional(),
    pickupLocation:joi.string().optional(),
    passenger:joi.array().items(joi.object().keys({
        FullName:joi.string().required(),
        phoneNumber:joi.string().required(),
        seat:joi.string().uuid().optional()

    })),
    profile:joi.object().keys({
        nextOfKin:joi.string().required(),
        nextOfKinPhoneNumber:joi.string().required(),
        address:joi.string().required()

    })




})