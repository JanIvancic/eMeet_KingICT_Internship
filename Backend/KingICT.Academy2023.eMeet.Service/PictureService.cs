using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Addresses;
using KingICT.Academy2023.eMeet.Messaging.Pictures;
using KingICT.Academy2023.eMeet.Model.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingICT.Academy2023.eMeet.Service
{
	public class PictureService : IPictureService
	{
		private readonly IPictureRepository _pictureRepository;

		public PictureService(IPictureRepository pictureRepository)
		{
			_pictureRepository = pictureRepository;
		}
		public async Task<List<PictureDTO>> GetAll()
		{
			var repoPictures = await _pictureRepository.GetAll();

			var PictureDTOs = repoPictures.Select(r => new PictureDTO
			{
				Id = r.IdPicture,
				Url = r.Url,
				Preference = r.Preference,
			}).ToList();

			return PictureDTOs;
		}

		public Task<PictureDTO> GetById(object id)
		{
			throw new NotImplementedException();
		}
	}
}
