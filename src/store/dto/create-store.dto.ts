import { IsNotEmpty, IsString } from 'class-validator';
// import { OwnerUserValidator } from 'src/validator/owner-user.validator';
// import { UniqueStoreOwnerValidator } from 'src/validator/unique-store-owner.validator';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  // @Validate(OwnerUserValidator)
  // @Validate(UniqueStoreOwnerValidator)
  owner_id: string;

  @IsNotEmpty()
  @IsString()
  store_name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
