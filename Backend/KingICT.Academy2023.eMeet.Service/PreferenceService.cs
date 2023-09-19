using KingICT.Academy2023.eMeet.Contract;
using KingICT.Academy2023.eMeet.Messaging.Preferences;
using KingICT.Academy2023.eMeet.Model.Repositories;
using KingICT.Academy2023.eMeet.Models.Models;

namespace KingICT.Academy2023.eMeet.Service
{
    public class PreferenceService : IPreferenceService
    {
        private readonly IPreferenceRepository _preferenceRepository;

        public PreferenceService(IPreferenceRepository preferenceRepository)
        {
            _preferenceRepository = preferenceRepository;
        }

        public async Task Delete(object id)
        {
            if (id == null)
                throw new ArgumentNullException(nameof(id));

            var preference = await _preferenceRepository.GetById(id);
            if (preference == null)
                throw new KeyNotFoundException($"Preference with ID {id} not found.");

            await _preferenceRepository.Delete(preference);
        }

        public async Task<List<PreferenceDTO>> GetAll()
        {
            var preferences = await _preferenceRepository.GetAll();

            var preferenceDTOs = preferences.Select(p => new PreferenceDTO
            {
                Id = p.IdPreference,
                Name = p.Name
            }).ToList();

            return preferenceDTOs;
        }

        public async Task<PreferenceDTO> GetById(object id)
        {
            var preference = await _preferenceRepository.GetById(id);

            if (preference == null)
                return null;

            return new PreferenceDTO
            {
                Id = preference.IdPreference,
                Name = preference.Name
            };
        }

        public async Task Insert(PreferenceDTO entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            var preference = new Preference
            {
                IdPreference = entity.Id,
                Name = entity.Name
            };

            await _preferenceRepository.Insert(preference);
        }

        public async Task Update(PreferenceDTO entity)
        {
            if (entity == null)
                throw new ArgumentNullException(nameof(entity));

            var preference = await _preferenceRepository.GetById(entity.Id);
            if (preference == null)
                throw new KeyNotFoundException($"Preference with ID {entity.Id} not found.");

            preference.Name = entity.Name;

            _preferenceRepository.Update(preference);
        }
    }
}
