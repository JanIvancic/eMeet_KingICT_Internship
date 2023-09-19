namespace KingICT.Academy2023.eMeet.Model.Repositories
{
    public interface IRepositoryBase<TEntity> where TEntity : class
    {
        Task<IEnumerable<TEntity>> GetAll();

        Task<TEntity> GetById(object id);

        Task<TEntity> Insert(TEntity entity, bool saveChanges = true);

        Task Update(TEntity entity, bool saveChanges = true);

        Task Delete(object id, bool saveChanges = true);

        Task SaveChanges();
    }
}
