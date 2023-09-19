--SELECT * FROM Feedback;

	CREATE TABLE [dbo].[UserWorkshop] (
    [UserId]         INT     NOT NULL,
    [WorkshopId]     INT     NOT NULL,
    [AttendanceType] TINYINT NOT NULL,
    [IsHost]         BIT     NOT NULL,
    CONSTRAINT [PK_UserWorkshop] PRIMARY KEY CLUSTERED ([UserId] ASC, [WorkshopId] ASC),
    CONSTRAINT [FK_UserWorkshop_User_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([IdUser]),
    CONSTRAINT [FK_UserWorkshop_Workshop_WorkshopId] FOREIGN KEY ([WorkshopId]) REFERENCES [dbo].[Workshop] ([IdWorkshop])
);








GO
CREATE NONCLUSTERED INDEX [IX_UserWorkshop_WorkshopId]
    ON [dbo].[UserWorkshop]([WorkshopId] ASC);

