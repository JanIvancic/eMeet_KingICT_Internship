using KingICT.Academy2023.eMeet.Messaging.Addresses;

namespace KingICT.Academy2023.eMeet.Messaging.Workshops
{
    public class WorkshopCard
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public int EventType { get; set; }
        public AddressDTO Address { get; set; }


        //--Workshop card to be placed in tileView-- has following props
        //Id
        //Name
        //Description
        //StartDateTime
        //EndDateTime
        //EventType
        //Addresses
    }
}
