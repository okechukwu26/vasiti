import { Entity, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, BaseEntity, Column, OneToMany } from "typeorm-plus";
import { Bookings } from "../Booking";

@Entity({ orderBy: { createdAt: "DESC" } })
export class Payments extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public amount: string;

    @Column()
    public referenceId: string;

  
    @Column()
    public method: string;

    @Column()
    public status: string;

    @OneToMany((type) => Bookings, (booking) => booking.payment)
    public booking: Bookings[];

    @UpdateDateColumn()
    public updatedAt: Date;

    @CreateDateColumn()
    public createdAt: Date;

}
