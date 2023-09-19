CREATE TABLE [dbo].[Room] (
    [IdRoom] INT            IDENTITY (1, 1) NOT NULL,
    [Name]   NVARCHAR (100) NOT NULL,
    [CityId] INT            NOT NULL,
    CONSTRAINT [PK_Room] PRIMARY KEY CLUSTERED ([IdRoom] ASC),
    CONSTRAINT [FK_Room_City_CityId] FOREIGN KEY ([CityId]) REFERENCES [dbo].[City] ([IdCity])
);


GO
CREATE NONCLUSTERED INDEX [IX_Room_CityId]
    ON [dbo].[Room]([CityId] ASC);

