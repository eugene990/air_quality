import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity({
  name: "air_quality"
})
export class AirQualityEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  datetime: Date;

  @Column({ nullable: true, default: null })
  city: string;

  @Column()
  ts: string;

  @Column()
  aqius: number;

  @Column()
  mainus: string;

  @Column()
  aqicn: number;

  @Column()
  maincn: string;
}
