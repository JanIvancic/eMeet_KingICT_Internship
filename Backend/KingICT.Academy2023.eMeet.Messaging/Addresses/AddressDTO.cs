using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Messaging.Addresses
{
	public class AddressDTO
	{
        public int Id { get; set; }
        public string CityName { get; set; }
		public string CountryName { get; set; }
		public string StreetName { get; set; }
		public string HouseNumber { get; set; }
		public string ZipCode { get; set; }

	}
}
