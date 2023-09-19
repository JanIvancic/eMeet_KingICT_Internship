--SELECT * FROM User

	CREATE TABLE [dbo].[Feedback] (
    [IdFeedback] INT            IDENTITY (1, 1) NOT NULL,
    [Comment]    NVARCHAR (300) NULL,
    [Rating]     INT            NOT NULL,
    [WorkshopId] INT            NOT NULL,
    [UserId]     INT            NOT NULL,
    CONSTRAINT [PK_Feedback] PRIMARY KEY CLUSTERED ([IdFeedback] ASC),
    CONSTRAINT [FK_Feedback_User_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([IdUser]),
    CONSTRAINT [FK_Feedback_Workshop_WorkshopId] FOREIGN KEY ([WorkshopId]) REFERENCES [dbo].[Workshop] ([IdWorkshop])
);










GO
CREATE NONCLUSTERED INDEX [IX_Feedback_WorkshopId]
    ON [dbo].[Feedback]([WorkshopId] ASC);


GO
CREATE NONCLUSTERED INDEX [IX_Feedback_UserId]
    ON [dbo].[Feedback]([UserId] ASC);

