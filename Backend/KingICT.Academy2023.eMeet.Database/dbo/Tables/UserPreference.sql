CREATE TABLE [dbo].[UserPreference] (
    [UserId]       INT NOT NULL,
    [PreferenceId] INT NOT NULL,
    CONSTRAINT [PK_UserPreference] PRIMARY KEY CLUSTERED ([PreferenceId] ASC, [UserId] ASC),
    CONSTRAINT [FK_UserPreference_Preference_PreferenceId] FOREIGN KEY ([PreferenceId]) REFERENCES [dbo].[Preference] ([IdPreference]),
    CONSTRAINT [FK_UserPreference_User_UserId] FOREIGN KEY ([UserId]) REFERENCES [dbo].[User] ([IdUser])
);




GO
CREATE NONCLUSTERED INDEX [IX_UserPreference_UserId]
    ON [dbo].[UserPreference]([UserId] ASC);

