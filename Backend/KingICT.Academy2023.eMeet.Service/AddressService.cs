using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Users;
using KingICT.Academy2023.eMeet.Model.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Service
{
	public class AddressService : IAddressService
	{
		private readonly IAddressRepository _addressRepository;

		public AddressService(IAddressRepository addressRepository)
		{
			_addressRepository = addressRepository;
		}

		public async Task<List<AddressDTO>> GetAll()
		{
			var addressRepo = await _addressRepository.GetAllWithDetails();
			var AddressDTOs = addressRepo.Select(a => new AddressDTO
			{
				Id = a.IdAddress,
				CityName = a.City.Name,
				CountryName = a.City.Country.Name,
				HouseNumber = a.HouseNumber,
				StreetName = a.StreetName,
				ZipCode = a.ZipCode
			}).ToList();

			return AddressDTOs;
		}

		public async Task<AddressDTO> GetById(object id)
		{
			var addressRepo = await _addressRepository.GetById(id);
			return new AddressDTO
			{
				Id = addressRepo.IdAddress,
				CityName = addressRepo.City.Name,
				CountryName = addressRepo.City.Country.Name,
				HouseNumber = addressRepo.HouseNumber,
				StreetName = addressRepo.StreetName,
				ZipCode = addressRepo.ZipCode
			};
		}
	}
}