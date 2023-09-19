CREATE TABLE [dbo].[Country] (
    [IdCountry] INT            IDENTITY (1, 1) NOT NULL,
    [Name]      NVARCHAR (100) NOT NULL,
    CONSTRAINT [PK_Country] PRIMARY KEY CLUSTERED ([IdCountry] ASC)
);







