import {
  addBooking,
  AssignBus,
  GetBookingWithVehicle,
  updateBooking,
  vehicleStatus,
  InTransit,
  bookingStatus,
  passengerStatus,
  searchBooking,
  refernce,
  manifest,
} from './bookingInterface';
import { AppError } from '../../utils';

import dayjs from 'dayjs';
import { Trips, Seats } from '../Trips';
import { In } from 'typeorm-plus';
import { Bookings } from './bookingModel';
import { Profile } from '../Profile';

import { Vehicles } from '../vehicle';
import { VehicleType } from '../vehicleType';
import { Passengers } from '../Passenger';
import { Users } from '../User';
import { VehicleStatus, BookingStatus, paymentType, BOOK } from '../../enums';

import { Payments, PaymentsService } from '../Payment';
import { CapTainService } from '../CaptainFee';
import { Routes } from '../Routes';
import { Terminals } from '../Terminal';
import { VehicleServiceLocation } from '../vehicleLocation';

export class BookingService {
  //customer booking

  public BookATrip = async (bookingData: addBooking, user?: Users) => {
    if (bookingData.referenceId === '') {
      throw new AppError('UnAuthorized', null, 404);
    }

    if (bookingData.service === 'book_a_seat') {
      if (bookingData.type === 'one_way') {
          const trip  = await Trips.findOneOrFail({where:[{
              id:bookingData.tripId
          }], relations:["route"]})
       .catch(() => {
          throw new AppError('invalid trip selected');
        });

        const date = dayjs(bookingData.travelDate).format('dddd').toLowerCase();
        const available = trip.Days.includes(date);
        if (!available) {
          throw new AppError(`Trip is not available for ${date}`);
        }
        console.log(trip)
        await this.verifySeat(
          trip.id,
          bookingData.seat,
          bookingData.numberOfTravellers,
          bookingData.travelDate
        );

        const payment = await this.verifyPayment(
          trip.price,
          bookingData.referenceId,
          bookingData.numberOfTravellers,
          user
        );

        let profile = await Profile.create(bookingData.profile).save();

        const bookingModels: Bookings[] = [];
        for (const passenger of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);

          let passengers = Passengers.create(passenger);
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;
          passengers.user = user;
          passengers.profile = profile;
          await passengers.save();

          bookingModel.passengerId = passengers;
          bookingModel.amount = trip.price;
          bookingModel.trip = trip;
          bookingModel.seat = passenger.seat;
          bookingModel.DepartureTerminal = trip.route.Terminal
          bookingModel.ArrivalTerminal= trip.route.route
          bookingModel.payment = payment;
          bookingModel.paymentType = paymentType.CARD,
            bookingModel.schedule = trip.schedule;
          bookingModel.service = bookingData.service;
          bookingModel.type = bookingData.type;
          bookingModel.numberOfTravellers = 1;
          bookingModel.referenceId = ref;
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTripId = trip.id;
          bookingModel.pickupLocation = bookingData.pickupLocation;

          bookingModels.push(bookingModel);
        }

        const bookings = await Bookings.save(bookingModels);

        return bookings;
      } else if (bookingData.type === 'round_trip') {
        if (
          !bookingData.returnTripId ||
          !bookingData.ReturnSeat ||
          !bookingData.returnDate
        ) {
          throw new AppError('incomplete Data');
        }

        const trip  = await Trips.findOneOrFail({where:[{
            id:bookingData.tripId
        }], relations:["route"]})
     .catch(() => {
        throw new AppError('invalid trip selected');
      });

        const ReturnTrip = await Trips.findOneOrFail({where:[{

            id: bookingData.returnTripId,
        }], relations:["route"]
        }).catch(() => {
          throw new AppError('invalid return trip');
        });

        const date = dayjs(bookingData.travelDate).format('dddd').toLowerCase();
        const available = trip.Days.includes(date);
        if (!available) {
          throw new AppError(`Trip is not available for ${date}`);
        }

        const Return = dayjs(bookingData.returnDate)
          .format('dddd')
          .toLowerCase();
        const isAvailable = ReturnTrip.Days.includes(Return);

        if (!isAvailable) {
          throw new AppError('Trip Return Date is not available for this trip');
        }

       

        await this.verifySeat(
          trip.id,
          bookingData.seat,
          bookingData.numberOfTravellers,
          bookingData.travelDate
        );

        await this.verifySeat(
          ReturnTrip.id,
          bookingData.ReturnSeat,
          bookingData.numberOfTravellers,
          bookingData.returnDate
        );
        const payment = await this.OneWayRounTrip(
          trip.price,
          bookingData.numberOfTravellers,
          bookingData.referenceId,
          user
        );
        const profile = await Profile.create(bookingData.profile).save();

        const bookingModels: Bookings[] = [];
        for (const roundTripPassenger of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const refe = `${hour}${min}-${month}${day}-${sec}${milli}`;
          let passenger = Passengers.create(roundTripPassenger);
          passenger.user = user;
          passenger.profile = profile;
          passenger = await passenger.save();
          bookingModel.passengerId = passenger;
          bookingModel.trip = trip;
          bookingModel.DepartureTerminal = trip.route.Terminal;
          bookingModel.ArrivalTerminal = trip.route.route
          bookingModel.payment = payment;
          bookingModel.amount = trip.price;
          bookingModel.paymentType = paymentType.CARD;
          bookingModel.schedule = trip.schedule;
          bookingModel.seat = roundTripPassenger.seat;
          bookingModel.ReturnSeat = roundTripPassenger.ReturnSeat;
          bookingModel.service = bookingData.service;
          bookingModel.type = bookingData.type;
          bookingModel.ReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedReturnTripId = bookingData.returnTripId;
          bookingModel.numberOfTravellers = 1;
          bookingModel.referenceId = refe;
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTripId = trip.id;

          bookingModels.push(bookingModel);
        }
        const bookings = await Bookings.save(bookingModels);

        const returnBookingModels: Bookings[] = [];
        for (const returnPasenger of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;
          let passenger = Passengers.create(returnPasenger);
          passenger.user = user;
          passenger.profile = profile;
          passenger = await passenger.save();
          bookingModel.passengerId = passenger;
          bookingModel.trip = ReturnTrip;
          bookingModel.ConfirmedReturnTripId = bookingData.returnTripId;
          bookingModel.ReturnTripId = ReturnTrip.id;
          bookingModel.seat = passenger.seat;
          bookingModel.DepartureTerminal = ReturnTrip.route.Terminal
          bookingModel.ArrivalTerminal = ReturnTrip.route.route
          bookingModel.amount = trip.price;
          bookingModel.ReturnSeat = returnPasenger.ReturnSeat;
          bookingModel.payment = payment;
          bookingModel.paymentType = paymentType.CARD;
          bookingModel.schedule = ReturnTrip.schedule;
          bookingModel.service = bookingData.service;
          bookingModel.type = bookingData.type;
          bookingModel.numberOfTravellers = 1;
          bookingModel.ConfirmedReturnDate = bookingData.returnDate;
          bookingModel.referenceId = ref;
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedTravelDate = bookingData.returnDate;
          bookingModel.ConfirmedTripId = trip.id;

          returnBookingModels.push(bookingModel);
        }

        const returnBookings = await Bookings.save(returnBookingModels);

        return { bookings, returnBookings };
      } else {
        throw new AppError('invalid booking type selected');
      }
    } else if (bookingData.service == 'hire_service') {
      if (bookingData.type == 'one_way') {
        const trip = await Trips.findOneOrFail({where:[{

            id: bookingData.tripId
        }], relations:["route"]
        }).catch(() => {
          throw new AppError('invalid trip selected');
        });
        const bookingModels: Bookings[] = [];

        const profile = await Profile.create(bookingData.profile).save();
        for (const passenger of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);
          let passengers = Passengers.create(passenger);
          passengers.profile = profile;
          passengers.user = user;
          await passengers.save();

          bookingModel.trip = trip;
          bookingModel.passengerId = passengers;
          bookingModel.referenceId = bookingData.referenceId;
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.schedule = trip.schedule;
          bookingModel.DepartureTerminal =trip.route.Terminal,
          bookingModel.ArrivalTerminal =trip.route.route
          bookingModel.amount = trip.price;
          bookingModel.numberOfTravellers = 5;
          bookingModel.ConfirmedTripId = trip.id;
          bookingModel.type = bookingData.type;
          bookingModel.service = bookingData.service;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModels.push(bookingModel);
        }
        const booking = await Bookings.save(bookingModels);

        return booking;
      } else if (bookingData.type == 'round_trip') {
        const trip = await Trips.findOneOrFail({
            where:[{

                id: bookingData.tripId,
            }], relations:["route"]
        }).catch(() => {
          throw new AppError('invalid trip selected');
        });
        const ReturnTrip = await Trips.findOneOrFail({where:[{

            id: bookingData.returnTripId,
        }], relations:["route"]
        });

        const date = dayjs(bookingData.travelDate).format('dddd').toLowerCase();
        const available = trip.Days.includes(date);
        if (!available) {
          throw new AppError(`Trip is not available for ${date}`);
        }

        const Return = dayjs(bookingData.returnDate)
          .format('dddd')
          .toLowerCase();
        const isAvailable = ReturnTrip.Days.includes(Return);

        if (!isAvailable) {
          throw new AppError('Trip Return DAte is not available for this trip');
        }

        const profile = await Profile.create(bookingData.profile).save();

        const bookingModels: Bookings[] = [];

        for (const passengers of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);

          let passenger = Passengers.create(passengers);
          passenger.user = user;
          passenger.profile = profile;
          await passenger.save();

          bookingModel.trip = trip;
          bookingModel.passengerId = passenger;
          bookingModel.ReturnTripId = ReturnTrip.id;
          bookingModel.ConfirmedReturnTripId = ReturnTrip.id;
          bookingModel.amount = trip.price;
          bookingModel.DepartureTerminal=trip.route.Terminal,
          bookingModel.ArrivalTerminal = trip.route.route,
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModel.ReturnDate = bookingData.returnDate;
          bookingModel.schedule = trip.schedule;
          bookingModel.ConfirmedReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedTripId = trip.id;
          bookingModel.numberOfTravellers = 7;
          bookingModel.referenceId = bookingData.referenceId;
          bookingModel.type = bookingData.type;
          bookingModel.service = bookingData.service;

          bookingModels.push(bookingModel);
        }

        const booking = await Bookings.save(bookingModels);

        const ReturnBookingModels: Bookings[] = [];
        for (const returnPassenger of bookingData.passenger) {
          const ReturnBookingModel = Bookings.create(bookingData);
          let returnPassengers = Passengers.create(returnPassenger);
          returnPassengers.user = user;
          returnPassengers.profile = profile;
          await returnPassengers.save();
          console.log(returnPassengers);
          ReturnBookingModel.passengerId = returnPassengers;
          ReturnBookingModel.referenceId = bookingData.referenceId;
          ReturnBookingModel.amount = trip.price;
          ReturnBookingModel.trip = ReturnTrip;
          ReturnBookingModel.DepartureTerminal= ReturnTrip.route.Terminal
          ReturnBookingModel.ArrivalTerminal = ReturnTrip.route.route
          ReturnBookingModel.ConfirmedTripId = ReturnTrip.id;
          ReturnBookingModel.ReturnTripId = ReturnTrip.id;
          ReturnBookingModel.schedule = ReturnTrip.schedule;
          ReturnBookingModel.ConfirmedReturnTripId = ReturnTrip.id;
          ReturnBookingModel.TravelDate = bookingData.returnDate;
          ReturnBookingModel.ConfirmedTravelDate = bookingData.returnDate;
          ReturnBookingModel.ReturnDate = bookingData.returnDate;
          ReturnBookingModel.ConfirmedReturnDate = bookingData.returnDate;
          ReturnBookingModel.numberOfTravellers = 7;
          ReturnBookingModel.service = bookingData.service;
          ReturnBookingModel.type = bookingData.type;
          ReturnBookingModels.push(ReturnBookingModel);
        }

        const ReturnBooking = await Bookings.save(ReturnBookingModels);

        return { booking, ReturnBooking };
      } else {
        throw new AppError('invalid service type selected');
      }
    } else {
      throw new AppError('invalid service type selected');
    }
  };
  private verifySeat = async (id, seat, passengers, TravelDate) => {
    const seats = await Seats.find({
      where: [
        {
          id: In(seat),
          trip: id,
        },
      ],
    });

    if (!seats || seats.length == 0) {
      throw new AppError('invalid seat id selected');
    } else if (seats.length != Number(passengers)) {
      throw new AppError(
        `Please select ${passengers} seats. Only ${seats.length} selected!`,
        seats
      );
    }

    const bookedSeat = [];
    try {
      for (const newSeat of seat) {
        const book = await Bookings.findOne({
          where: [
            {
              seat: newSeat,
              TravelDate: TravelDate,
              service: BOOK.BOOK_A_SEAT,
            },
          ],
        });
        bookedSeat.push(book);
      }

      const unAvailable = bookedSeat.includes(undefined);
      console.log(unAvailable, bookedSeat);
      if (!unAvailable || bookedSeat === []) {
        throw new AppError('seat already booked');
      }
    } catch (error) {
      throw new AppError(error);
    }

    return seats;
  };

  public UserBooking = async (bookingData: addBooking, user: Users) => {
    if (user.block === true) {
      throw new AppError('UnAuthorized', null, 404);
    }
    const Authorized = user.priviledges.includes('ticket');

    if (!Authorized) {
      console.log('hello');
    }
    const trip  = await Trips.findOneOrFail({where:[{
      id:bookingData.tripId
  }], relations:["route"]})
.catch(() => {
  throw new AppError('invalid trip selected');
});
    const payment = {
      amount: String(trip.price),
      method: 'offline',
      status: 'paid',
      referenceId: user.id,
    };

    if (bookingData.service === 'book_a_seat') {
      if (bookingData.type === 'one_way') {
        const date = dayjs(bookingData.travelDate).format('dddd').toLowerCase();
        const available = trip.Days.includes(date);
        if (!available) {
          throw new AppError(`Trip is not available for ${date}`);
        }
        await this.verifySeat(
          trip.id,
          bookingData.seat,
          bookingData.numberOfTravellers,
          bookingData.travelDate
        );

        let profile = await Profile.create(bookingData.profile).save();

        const payments = await Payments.create(payment).save();

        const bookingModels: Bookings[] = [];

        for (const passenger of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);
          let passengers = Passengers.create(passenger);
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;

          passengers.user = user;
          passengers.profile = profile;
          await passengers.save();
          bookingModel.passengerId = passengers;
          bookingModel.profile =profile
          bookingModel.trip = trip;
          bookingModel.seat = passenger.seat;
          bookingModel.ArrivalTerminal=trip.route.route;
          bookingModel.DepartureTerminal=trip.route.Terminal;
          bookingModel.amount = trip.price;
          bookingModel.payment = payments;
          bookingModel.passengerId = passengers;
          (bookingModel.paymentType = bookingData.paymentType),
            (bookingModel.schedule = trip.schedule);
          bookingModel.service = bookingData.service;
          bookingModel.type = bookingData.type;
          bookingModel.numberOfTravellers = 1;
          bookingModel.referenceId = ref;

          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTripId = trip.id;
          bookingModel.pickupLocation = bookingData.pickupLocation;

          bookingModels.push(bookingModel);
        }

        const book = await Bookings.save(bookingModels);
        return book;
      } else if (bookingData.type === 'round_trip') {
        if (
          !bookingData.returnTripId ||
          !bookingData.ReturnSeat ||
          !bookingData.returnDate
        ) {
          throw new AppError('incomplete Data');
        }

        const ReturnTrip = await Trips.findOneOrFail({
          id: bookingData.returnTripId,
        }).catch(() => {
          throw new AppError('invalid return trip');
        });
        const date = dayjs(bookingData.travelDate).format('dddd').toLowerCase();
        const available = trip.Days.includes(date);
        if (!available) {
          throw new AppError(`Trip is not available for ${date}`);
        }

        const Return = dayjs(bookingData.returnDate)
          .format('dddd')
          .toLowerCase();
        const isAvailable = ReturnTrip.Days.includes(Return);

        if (!isAvailable) {
          throw new AppError('Trip Return Date is not available for this trip');
        }
        const amount = Number(
          bookingData.amount / bookingData.numberOfTravellers
        );
        await this.verifySeat(
          trip.id,
          bookingData.seat,
          bookingData.numberOfTravellers,
          bookingData.travelDate
        );
        await this.verifySeat(
          ReturnTrip.id,
          bookingData.ReturnSeat,
          bookingData.numberOfTravellers,
          bookingData.returnDate
        );
        let profile = await Profile.create(bookingData.profile).save();

        const payments = await Payments.create(payment).save();
        console.log(amount);

        const bookingModels: Bookings[] = [];

        for (const roundTrip of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;
          let passenger = Passengers.create(roundTrip);
          passenger.user = user;
          passenger.profile = profile;
          passenger = await passenger.save();
          bookingModel.passengerId = passenger;
          bookingModel.trip = trip;
          bookingModel.payment = payments;
          bookingModel.amount = trip.price;
          bookingModel.referenceId = ref,
            bookingModel.paymentType = bookingData.paymentType;
          bookingModel.schedule = trip.schedule;
          bookingModel.seat = roundTrip.seat;
          bookingModel.ReturnSeat = roundTrip.ReturnSeat;
          bookingModel.service = bookingData.service;
          bookingModel.type = bookingData.type;
          bookingModel.ReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedReturnTripId = bookingData.returnTripId;
          bookingModel.numberOfTravellers = 1;
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTripId = trip.id;

          bookingModels.push(bookingModel);
        }
        const bookings = await Bookings.save(bookingModels);

        const returnBookingModels: Bookings[] = [];
        for (const returnPasenger of bookingData.passenger) {
          const bookingModel = Bookings.create(bookingData);
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;
          let passenger = Passengers.create(returnPasenger);
          passenger.user = user;
          passenger.profile = profile;
          passenger = await passenger.save();
          bookingModel.passengerId = passenger;
          bookingModel.trip = ReturnTrip;
          bookingModel.ConfirmedReturnTripId = bookingData.returnTripId;
          bookingModel.ReturnTripId = ReturnTrip.id;
          bookingModel.seat = passenger.seat;
          bookingModel.amount = trip.price;
          bookingModel.ReturnSeat = returnPasenger.ReturnSeat;
          bookingModel.payment = payments;
          bookingModel.paymentType = bookingData.paymentType;
          bookingModel.schedule = ReturnTrip.schedule;
          bookingModel.service = bookingData.service;
          bookingModel.type = bookingData.type;
          bookingModel.numberOfTravellers = 1;
          bookingModel.ConfirmedReturnDate = bookingData.returnDate;
          bookingModel.referenceId = ref;
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedTravelDate = bookingData.returnDate;
          bookingModel.ConfirmedTripId = trip.id;

          returnBookingModels.push(bookingModel);
        }

        const returnBookings = await Bookings.save(returnBookingModels);

        return { bookings, returnBookings };
      } else {
        throw new AppError('invalid booking type selected');
      }
    } else if (bookingData.service === 'hire_service') {
      if (bookingData.type === 'one_way') {
        const bookingModels: Bookings[] = [];

        const profile = await Profile.create(bookingData.profile).save();
        const payments = await Payments.create(payment).save();
        for (const passenger of bookingData.passenger) {
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;

          const bookingModel = Bookings.create(bookingData);
          let passengers = Passengers.create(passenger);
          passengers.profile = profile;
          passengers.user = user;
          await passengers.save();

          bookingModel.trip = trip;
          bookingModel.passengerId = passengers;
          bookingModel.referenceId = ref;
          bookingModel.TravelDate = bookingData.travelDate;
          (bookingModel.schedule = trip.schedule),
            (bookingModel.payment = payments);
          bookingModel.amount = trip.price;
          bookingModel.numberOfTravellers = 7;
          bookingModel.ConfirmedTripId = trip.id;
          bookingModel.type = bookingData.type;
          bookingModel.service = bookingData.service;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModel.paymentType = bookingData.paymentType;
          bookingModels.push(bookingModel);
        }
        const booking = await Bookings.save(bookingModels);

        return booking;
      } else if (bookingData.type === 'round_trip') {
        const ReturnTrip = await Trips.findOneOrFail({
          id: bookingData.returnTripId,
        });

        const profile = await Profile.create(bookingData.profile).save();

        const bookingModels: Bookings[] = [];
        const payments = await Payments.create(payment).save();

        for (const passengers of bookingData.passenger) {
          const bookingModel = Bookings.create(passengers);
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;

          let passenger = Passengers.create(passengers);
          passenger.user = user;
          passenger.profile = profile;
          await passenger.save();
          bookingModel.payment = payments;
          bookingModel.referenceId = ref;
          bookingModel.paymentType = bookingData.paymentType;
          bookingModel.trip = trip;
          bookingModel.passengerId = passenger;
          bookingModel.ReturnTripId = ReturnTrip.id;
          bookingModel.ConfirmedReturnTripId = ReturnTrip.id;
          bookingModel.amount = trip.price;
          bookingModel.TravelDate = bookingData.travelDate;
          bookingModel.ConfirmedTravelDate = bookingData.travelDate;
          bookingModel.ReturnDate = bookingData.returnDate;
          bookingModel.schedule = trip.schedule;
          bookingModel.ConfirmedReturnDate = bookingData.returnDate;
          bookingModel.ConfirmedTripId = trip.id;
          bookingModel.numberOfTravellers = 7;

          bookingModel.type = bookingData.type;
          bookingModel.service = bookingData.service;

          bookingModels.push(bookingModel);
        }
        const booking = await Bookings.save(bookingModels);

        const ReturnBookingModels: Bookings[] = [];
        for (const returnPassenger of bookingData.passenger) {
          const month = dayjs(new Date()).format('MMM').charAt(0).toUpperCase();
          const day = dayjs(new Date()).format('dd').charAt(0).toUpperCase();
          const hour = dayjs(new Date()).format('hh');
          const min = dayjs(new Date()).format('mm');
          const sec = dayjs(new Date()).format('ss');
          const milli = dayjs(new Date()).format('SSS');
          const ref = `${hour}${min}-${month}${day}-${sec}${milli}`;
          const ReturnBookingModel = Bookings.create(bookingData);
          let returnPassengers = Passengers.create(returnPassenger);
          returnPassengers.user = user;
          returnPassengers.profile = profile;
          await returnPassengers.save();
          ReturnBookingModel.passengerId = returnPassengers;
          ReturnBookingModel.referenceId = ref;
          ReturnBookingModel.payment = payments;
          ReturnBookingModel.paymentType = bookingData.paymentType;
          ReturnBookingModel.amount = trip.price;
          ReturnBookingModel.trip = ReturnTrip;
          ReturnBookingModel.ConfirmedTripId = ReturnTrip.id;
          ReturnBookingModel.ReturnTripId = ReturnTrip.id;
          ReturnBookingModel.schedule = ReturnTrip.schedule;
          ReturnBookingModel.ConfirmedReturnTripId = ReturnTrip.id;
          ReturnBookingModel.TravelDate = bookingData.returnDate;
          ReturnBookingModel.ConfirmedTravelDate = bookingData.returnDate;
          ReturnBookingModel.ReturnDate = bookingData.returnDate;
          ReturnBookingModel.ConfirmedReturnDate = bookingData.returnDate;
          ReturnBookingModel.numberOfTravellers = 7;
          ReturnBookingModel.pickupLocation = bookingData.pickupLocation;
          ReturnBookingModel.service = bookingData.service;
          ReturnBookingModel.type = bookingData.type;
          ReturnBookingModels.push(ReturnBookingModel);

          console.log(returnPassengers);
        }
        const returnBooking = await Bookings.save(ReturnBookingModels);

        return { booking, returnBooking };
      } else {
        throw new AppError('invalid booking type selected');
      }
    } else {
      throw new AppError('invalid booking service selected');
    }
  };

  //Assigning Bus to passengers

  public assignus = async (bookingData: AssignBus, user: Users) => {
    if (!user.priviledges.includes('manager')) {
      throw new AppError('UnAuthorized', null, 404);
    }
    if (user.block) {
      throw new AppError('UnAuthorized', null, 404);
    }

    const trip = await Trips.findOneOrFail({
      where: [
        {
          id: bookingData.tripId,
          schedule: bookingData.schedule,
          type: bookingData.typeId,
        },
      ],
      relations: ['type', 'route'],
    }).catch(() => {
      throw new AppError('invalid trip selected');
    });
    const route = await Routes.findOneOrFail({
      where: [
        {
          id: trip.route.id,
        },
      ],
      relations: ['terminal'],
    }).catch(() => {
      throw new AppError('invalid route selected');
    });
    if (user.Terminal !== route.terminal.id) {
      throw new AppError('UnAuthorized', null, 404);
    }

    const type = await VehicleType.findOneOrFail({
      where: [
        {
          id: trip.type.id,
        },
      ],
      relations: ['feature'],
    }).catch(() => {
      throw new AppError('invalid vehicle type selected');
    });

    const vehicle = await Vehicles.findOne({
      where: [
        {
          id: bookingData.vehicleId,
          vehicleType: type.id,
          vehicleStatus: VehicleStatus.AVAILABLE,
        },
      ],
    });

    if (!vehicle) {
      throw new AppError(
        'vehicle is already in transit or already assigned to a trip'
      );
    }

    const booking = await Bookings.find({
      where: [
        {
          ConfirmedTravelDate: bookingData.travelDate,
          service: bookingData.service,
          type: bookingData.type,
          trip: trip.id,
          schedule: trip.schedule,
          bookingStatus: BookingStatus.CHECK_IN_AND_APPROVED,
        },
      ],
    });

    const booked = await Bookings.find({
      where: [
        {
          vehicle: vehicle.id,
        },
      ],
    });
    if (booked.length > type.seatNumber) {
      throw new AppError('bookings length has exceeded vehicle seat');
    }

    if (bookingData.service == 'book_a_seat') {
      if (booking.length > type.seatNumber) {
        throw new AppError(
          'number of passengers is greater than vehicle seat number'
        );
      }
      if (booking.length === 0) {
        throw new AppError(`you can not assigned a vehicle to an empty trip`);
      }
      booking.forEach(async (item) => {
        if (item.bookingStatus == BookingStatus.CHECK_IN_AND_APPROVED) {
          item.vehicle = vehicle.id;
          await item.save();
        } else {
          throw new AppError(
            'passenger has to be checked in before assigning a vehicle to them'
          );
        }
      });

      vehicle.vehicleStatus = VehicleStatus.ASSIGNED;
      await vehicle.save();

      return 'passenger has been assigned to a vehicle';
    } else if (bookingData.service == 'hire_service') {
      if (booking.length === 0) {
        throw new AppError('you can not assign a vehicle to an empty trip');
      }
      booking.forEach(async (item) => {
        if (item.bookingStatus === BookingStatus.CHECK_IN_AND_APPROVED) {
          item.vehicle = vehicle.id;
          return await item.save();
        } else {
          throw new AppError(
            'passenger has to be checked in before assigning a vehicle to them'
          );
        }
      });
      vehicle.vehicleStatus = VehicleStatus.ASSIGNED;
      await vehicle.save();
      return;
    } else {
      throw new AppError('invalid booking service selected');
    }
  };
  //vehicle in transit
  public InTransit = async (transitData: InTransit, user: Users) => {
    if (!user.priviledges.includes('manager')) {
      throw new AppError('UnAuthorized', null, 404);
    }
    if (user.block) {
      throw new AppError('UnAuthorized', null, 404);
    }

    const route = await Routes.findOneOrFail({
      where: [
        {
          route: transitData.route,
          terminal: user.Terminal,
        },
      ],
      relations: ['terminal'],
    }).catch(() => {
      throw new AppError('invalid route selected');
    });
    console.log(route);

    // console.log(route.terminal, user.Terminal)
    if (user.Terminal !== route.terminal.id) {
      throw new AppError('UnAuthorized', null, 404);
    }

    const trip = await Trips.findOneOrFail({
      where: [
        {
          route: route.id,
          schedule: transitData.schedule,
        },
      ],
    }).catch(() => {
      throw new AppError('invalid trip selected');
    });

   

    const booking = await Bookings.findOne({
      where: [
        {
         ConfirmedTravelDate: transitData.travelDate,
          ConfirmedTripId: trip.id,
          vehicle: transitData.vehicleId,
        },
      ],
    });
    if (booking === undefined) {
      throw new AppError(
        'no booking has been done on this trip and on this day'
      );
    }

    const vehicle = await Vehicles.findOneOrFail({
      where: [
        { id: transitData.vehicleId, vehicleStatus: VehicleStatus.ASSIGNED },
      ],
    }).catch(() => {
      throw new AppError('invalid vehicle selected');
    });
    vehicle.vehicleStatus = VehicleStatus.IN_TRANSIT;

    const captainFee = new CapTainService();
    await captainFee.createCaptainFee(trip, vehicle, transitData, route);
    const location = new VehicleServiceLocation();

    const info = {
      location: route.route,
      left: route.Terminal,
      vehicle: vehicle,
      headingTo: route.route,
      status: VehicleStatus.IN_TRANSIT,
    };
    await location.CreateVehicleLocation(info);
    await vehicle.save();
    const terminal = await Terminals.findOneOrFail({
      where: [{ id: user.Terminal }],
      relations: ['state', 'lga'],
    });

    console.log(terminal);
    return 'captain fee and vehicle updated';
  };

  public GetBookingWithVehicles = async (
    bookingData: GetBookingWithVehicle,
    user: Users
  ) => {
    if (user.block) {
      throw new AppError('UnAuthorized', null, 404);
    }
    if (!user.priviledges.includes('manager')) {
      throw new AppError('UnAuthorized', null, 404);
    }

    const booking = await Bookings.find({
      where: [
        {
          TravelDate: bookingData.travelDate,
          schedule: bookingData.schedule,
          vehicle: bookingData.vehicle,
          trip: bookingData.tripId,
          service: bookingData.service,
          type: bookingData.type,
        },
      ],
      relations: ['passengerId'],
    });

    let data;
    let book = [];

    for (let profile of booking) {
      const prof = await Passengers.find({
        where: [{ id: profile.passengerId.id }],
        relations: ['profile'],
      });

      data = prof[0].profile;
      book.push({ ...profile, ...data });
    }

    return book;
  };
  public checkBookingStatus = async () => {};

  //updating passenger booking status
  public updataBookingStatus = async (update: updateBooking, user: Users) => {
    if (user.block) {
      throw new AppError('UnAuthorized', null, 404);
    }
    if (!user.priviledges.includes('ticket')) {
      throw new AppError('UnAuthorized', null, 404);
    }

    const booking = await Bookings.findOneOrFail({
      where: [
        {
          ConfirmedTravelDate: update.travelDate,
          referenceId: update.referenceId,
        },
      ],
    }).catch(() => {
      throw new AppError('Invalid credential');
    });
    if (booking.bookingStatus === BookingStatus.CHECK_IN_AND_APPROVED) {
      return 'Already checked in';
    }

    booking.bookingStatus = BookingStatus.CHECK_IN_AND_APPROVED;
    await booking.save();

    return 'Booking updated';
  };

  //vehicle arrived at terminal
  public vehicleArrived = async (status: vehicleStatus, user: Users) => {
    if (!user.priviledges.includes('manager')) {
      throw new AppError('UnAuthorized', null, 404);
    }
    if (user.block) {
      throw new AppError('UnAuthorized', null, 404);
    }

    const route = await Routes.findOneOrFail({
      where: [{ id: status.routeId }],
      relations: ['terminal'],
    }).catch(() => {
      throw new AppError('invalid route selected');
    });

    let vehicle = await Vehicles.findOne({
      where: [
        {
          id: status.id,
        },
      ],
    });
    if (!vehicle) {
      throw new AppError('invalid vehicle selected');
    }

    vehicle.vehicleStatus = status.status;
    const location = new VehicleServiceLocation();
    const info = {
      location: route.route,
      headingTo: route.route,
      left: route.Terminal,
      status: status.status,
      vehicle: vehicle,
    };
    await location.CreateVehicleLocation(info);
    await vehicle.save();
    return 'vehicle updated';
  };

  private async verifyPayment(trip, ref, numberOfTraveller, user: Users) {
    const tripPrice = Number(trip) * numberOfTraveller;
    const paymentService = new PaymentsService();

    const verifyPaymentResponse = await paymentService.verifyPayment(ref);
    if (
      verifyPaymentResponse.status &&
      verifyPaymentResponse.data.status === 'success'
    ) {
      const paymentData = verifyPaymentResponse.data;
      const amount = paymentData.amount / 100;
      if (user) {
        const expectedTotal = tripPrice;
        if (amount === expectedTotal) {
          const paymentModel = {
            amount: String(amount),
            method: paymentData.channel,
            currency: paymentData.currency,
            referenceId: paymentData.reference,
            status: 'paid',
            type: 'card',
          };

          return Payments.create(paymentModel).save();
        } else {
          throw new AppError(` expected ${expectedTotal} but got ${amount}`);
        }
      } else {
        const expected = tripPrice;
        if (amount === expected) {
          const paymentModel = {
            amount: String(amount),
            method: paymentData.channel,
            currency: paymentData.currency,
            referenceId: paymentData.reference,
            status: 'paid',
          };
          return Payments.create(paymentModel).save();
        } else {
          throw new AppError(` expected ${expected} but got ${amount}`);
        }
      }
    } else {
      throw new AppError('invalid transaction');
    }
  }

  public changeToDelay = async (bookingData: bookingStatus, user: Users) => {
    if (user.block === true) {
      throw new AppError('UnAuthorized', null, 404);
    }
    const authorize = user.priviledges.includes("manager")
      if(!authorize){
        throw new AppError('UnAuthorized', null, 404);

      }

      console.log(bookingData)
      
        
        const booking = await Bookings.findOneOrFail({where:[{
          referenceId:bookingData.id,
          vehicle:null,
          bookingStatus:BookingStatus.APPROVED
        }]}).catch(() =>{
          throw new AppError("Invalid data")
        })
        booking.bookingStatus = BookingStatus.DELAY
       await booking.save()
       return "Passenger status changed to delay"
     

  
   
    // booking.bookingStatus = BookingStatus.DELAY;

    // await booking.save();
    // return 'status updated';
  };

  public changePassengerStatus = async (bookingData: passengerStatus) => {
    const updates = Object.keys(bookingData);
    const isAllowed = ['trip', 'schedule', 'ConfirmedTravelDate', "referenceId", "bookingStatus"];
    const isMatch = updates.every((item) => isAllowed.includes(item));

    if (!isMatch) {
      throw new AppError('invalid update');
    }
    
    try {
      const booking = await Bookings.findOneOrFail({where:[{referenceId:bookingData.referenceId,
      bookingStatus:BookingStatus.DELAY}]}).catch(() => {throw new AppError("no referenceId match this search")})
      
      updates.forEach(item => booking[item] = bookingData[item])
      return await booking.save()
           
      
    } catch (error) {
      throw new AppError(error)
      
    }
  };
  public TransLoading = async () => {
    // const booking= await Bookings.findOneOrFail({where:[{
    // }]})
  };

  private OneWayRounTrip = async (trip, passenger, ref, user: Users) => {
    try {
      const price = Number(trip) * passenger;
      const paymentService = new PaymentsService();
      console.log(price);
      const verifyPaymentResponse = await paymentService.verifyPayment(ref);
      if (
        verifyPaymentResponse.status &&
        verifyPaymentResponse.data.status === 'success'
      ) {
        const paymentData = verifyPaymentResponse.data;
        const amount = paymentData.amount / 100;
        console.log(paymentData, amount);
        const PaymentModel = {
          amount: String(amount),
          method: paymentData.channel,
          currency: paymentData.currency,
          referenceId: paymentData.reference,
          status: 'paid',
        };
        return Payments.create(PaymentModel).save();
      } else {
        throw new AppError('invalid transaction');
      }
    } catch (error) {
      console.log(error);
    }
  };
  public SearchBooking = async (bookingData:searchBooking, user:Users) =>{
      if(user.block){
          throw new AppError("UnAuthorized")
      }
      const isValid = user.priviledges.includes("customer")
      if(isValid){
          throw new AppError("UnAuthorized")
      }
      try {
          
          const search = await Bookings.find({where:[{
              DepartureTerminal:bookingData.departureTerminal,
              ArrivalTerminal:bookingData.arrivalTerminal,
              TravelDate:bookingData.travelDate

          }],})
          return search

      } catch (error) {
         throw new AppError("No booking was done on this travel date")
          
      }
  }

  public Reference = async(reference:refernce, user:Users) =>{
      if(user.block){
          throw new AppError("UnAuthorized")
      }
      const isValid = user.priviledges.includes("customer")
      if(isValid){
          throw new AppError("UnAuthorized")
      }
      const ref = await Bookings.findOneOrFail({where:[{referenceId:reference.id}]}).catch(() =>{
        throw new AppError("Invalid reference Number")
      })
    
    
      return ref

  }
  public PrintManifest = async (manifest:manifest, user:Users) =>{

    
    
    if(user.block){
      throw new AppError("UnAuthorized", null, 404)
    }
    if(user.priviledges.includes("customer")){
      throw new AppError("UnAuthorized", null, 404)
    }
    try {
      const print = await Bookings.find({where:[{
        vehicle:manifest.vehicleId,
        schedule:manifest.schedule,
        TravelDate:manifest.travelDate,
        
      }]})
      console.log(print, print.length)
      if(print.length !== 0){
        const vehicle = await Vehicles.findOne({id:manifest.vehicleId})
        return {print, vehicle}

      }
      else{
        throw new AppError("invalid data")
      }
  
    } catch (error) {
   throw new AppError("invalid data")
      
    }

    
  }


}
