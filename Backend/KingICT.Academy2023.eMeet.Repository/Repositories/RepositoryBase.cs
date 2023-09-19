using KingICT.Academy2023.eMeet.Model.Repositories;
using Microsoft.EntityFrameworkCore;

namespace KingICT.Academy2023.eMeet.Repository.Repositories
{
    public class RepositoryBase<TEntity> : IRepositoryBase<TEntity> where TEntity : class
    {
        protected readonly DbContext DbContext;
        protected readonly DbSet<TEntity> DbSet;

        public RepositoryBase(DbContext context)
        {
            DbContext = context;
            DbSet = context.Set<TEntity>();
        }

        public async Task<IEnumerable<TEntity>> GetAll()
        {
            return await DbSet.ToListAsync();
        }

        public async Task<TEntity> GetById(object id)
        {
            return await DbSet.FindAsync(id);
        }

        public async Task<TEntity> Insert(TEntity entity, bool saveChanges = true)
        {
            await DbSet.AddAsync(entity);

            if (saveChanges)
                await SaveChanges();
            return entity;
        }

        public async Task Update(TEntity entity, bool saveChanges = true)
        {
            DbSet.Attach(entity);
            DbSet.Update(entity);

            if (saveChanges)
                await SaveChanges();
        }

        public async Task Delete(object id, bool saveChanges = true)
        {
            TEntity entityToDelete = await DbSet.FindAsync(id);
            Delete(entityToDelete);

            if (saveChanges)
                await SaveChanges();
        }

        public void Delete(TEntity entityToDelete)
        {
            if (entityToDelete != null)
            {
                DbSet.Remove(entityToDelete);
            }
        }

        public async Task SaveChanges()
        {
            await DbContext.SaveChangesAsync();
        }
    }
}
