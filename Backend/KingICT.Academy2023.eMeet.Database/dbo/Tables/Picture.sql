CREATE TABLE [dbo].[Picture] (
    [IdPicture]  INT            IDENTITY (1, 1) NOT NULL,
    [BinaryCode] NVARCHAR (MAX) NOT NULL,
    [WorkshopId] INT            NOT NULL,
    CONSTRAINT [PK_Picture] PRIMARY KEY CLUSTERED ([IdPicture] ASC),
    CONSTRAINT [FK_Picture_Workshop_WorkshopId] FOREIGN KEY ([WorkshopId]) REFERENCES [dbo].[Workshop] ([IdWorkshop])
);








GO
CREATE NONCLUSTERED INDEX [IX_Picture_WorkshopId]
    ON [dbo].[Picture]([WorkshopId] ASC);

