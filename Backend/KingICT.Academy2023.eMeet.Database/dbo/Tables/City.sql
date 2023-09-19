--SELECT * FROM Country;


	CREATE TABLE [dbo].[City] (
    [IdCity]    INT            IDENTITY (1, 1) NOT NULL,
    [Name]      NVARCHAR (100) NOT NULL,
    [CountryId] INT            NOT NULL,
    CONSTRAINT [PK_City] PRIMARY KEY CLUSTERED ([IdCity] ASC),
    CONSTRAINT [FK_City_Country_CountryId] FOREIGN KEY ([CountryId]) REFERENCES [dbo].[Country] ([IdCountry])
);








GO
CREATE NONCLUSTERED INDEX [IX_City_CountryId]
    ON [dbo].[City]([CountryId] ASC);

