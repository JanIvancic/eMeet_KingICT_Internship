CREATE TABLE [dbo].[Preference] (
    [IdPreference] INT           IDENTITY (1, 1) NOT NULL,
    [Name]         NVARCHAR (20) NOT NULL,
    CONSTRAINT [PK_Preference] PRIMARY KEY CLUSTERED ([IdPreference] ASC)
);





