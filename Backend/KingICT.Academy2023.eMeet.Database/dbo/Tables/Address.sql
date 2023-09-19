--SELECT * FROM UserWorkshop;

	CREATE TABLE [dbo].[Address] (
    [IdAddress]   INT            IDENTITY (1, 1) NOT NULL,
    [StreetName]  NVARCHAR (100) NOT NULL,
    [HouseNumber] NVARCHAR (10)  NOT NULL,
    [ZipCode]     NVARCHAR (10)  NOT NULL,
    [CityId]      INT            NOT NULL,
    CONSTRAINT [PK_Address] PRIMARY KEY CLUSTERED ([IdAddress] ASC),
    CONSTRAINT [FK_Address_City_CityId] FOREIGN KEY ([CityId]) REFERENCES [dbo].[City] ([IdCity])
);






GO
CREATE NONCLUSTERED INDEX [IX_Address_CityId]
    ON [dbo].[Address]([CityId] ASC);

