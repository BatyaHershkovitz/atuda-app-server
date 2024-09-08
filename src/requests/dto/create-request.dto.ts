export class CreateRequestDto {
  readonly userIdentity: string;
  readonly requestTypeId: number;
  readonly requestDetails: JSON;
}
