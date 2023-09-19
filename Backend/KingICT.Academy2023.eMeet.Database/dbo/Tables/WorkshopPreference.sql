CREATE TABLE [dbo].[WorkshopPreference] (
    [WorkshopId]   INT NOT NULL,
    [PreferenceId] INT NOT NULL,
    CONSTRAINT [PK_WorkshopPreference] PRIMARY KEY CLUSTERED ([WorkshopId] ASC, [PreferenceId] ASC),
    CONSTRAINT [FK_WorkshopPreference_Preference_PreferenceId] FOREIGN KEY ([PreferenceId]) REFERENCES [dbo].[Preference] ([IdPreference]),
    CONSTRAINT [FK_WorkshopPreference_Workshop_WorkshopId] FOREIGN KEY ([WorkshopId]) REFERENCES [dbo].[Workshop] ([IdWorkshop])
);




GO
CREATE NONCLUSTERED INDEX [IX_WorkshopPreference_PreferenceId]
    ON [dbo].[WorkshopPreference]([PreferenceId] ASC);

