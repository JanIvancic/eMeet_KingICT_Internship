CREATE TABLE [dbo].[WorkshopAddress] (
    [WorkshopId] INT NOT NULL,
    [AddressId]  INT NOT NULL,
    CONSTRAINT [PK_WorkshopAddress] PRIMARY KEY CLUSTERED ([AddressId] ASC, [WorkshopId] ASC),
    CONSTRAINT [FK_WorkshopAddress_Address_AddressId] FOREIGN KEY ([AddressId]) REFERENCES [dbo].[Address] ([IdAddress]),
    CONSTRAINT [FK_WorkshopAddress_Workshop_WorkshopId] FOREIGN KEY ([WorkshopId]) REFERENCES [dbo].[Workshop] ([IdWorkshop])
);




GO
CREATE NONCLUSTERED INDEX [IX_WorkshopAddress_WorkshopId]
    ON [dbo].[WorkshopAddress]([WorkshopId] ASC);

