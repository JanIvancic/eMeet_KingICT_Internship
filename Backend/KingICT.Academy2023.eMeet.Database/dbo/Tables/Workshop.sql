--SELECT * FROM City;

	CREATE TABLE [dbo].[Workshop] (
    [IdWorkshop]          INT            IDENTITY (1, 1) NOT NULL,
    [Name]                NVARCHAR (150) NOT NULL,
    [StartDateTime]       DATETIME2 (7)  NOT NULL,
    [EndDateTime]         DATETIME2 (7)  NOT NULL,
    [Availability]        BIT            NOT NULL,
    [Description]         TEXT           NOT NULL,
    [AccessLink]          NVARCHAR (MAX) NULL,
    [EventType]           TINYINT        NOT NULL,
    [MaxAttendeesOffline] INT            NOT NULL,
    [MaxAttendeesOnline]  INT            NOT NULL,
    [IsCancelled]         BIT            NOT NULL,
    [RoomId]              INT            NOT NULL,
    CONSTRAINT [PK_Workshop] PRIMARY KEY CLUSTERED ([IdWorkshop] ASC),
    CONSTRAINT [FK_Workshop_Room_RoomId] FOREIGN KEY ([RoomId]) REFERENCES [dbo].[Room] ([IdRoom])
);














GO
CREATE NONCLUSTERED INDEX [IX_Workshop_RoomId]
    ON [dbo].[Workshop]([RoomId] ASC);

