export interface IContact {
    firstName:string,
    lastName:string,
    name:string
    phone:string,
    emails:{label:string, email:string}[],
    phoneNumbers:{label:string, number:string}[],
    addresses:{city:string, street:string, region:string, country:string, postalCode:string, isoCountryCode:string}[],
}
