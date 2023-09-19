--SELECT * FROM Workshop;


	CREATE TABLE [dbo].[User] (
    [IdUser]             INT            IDENTITY (1, 1) NOT NULL,
    [FirstName]          NVARCHAR (50)  NOT NULL,
    [LastName]           NVARCHAR (50)  NOT NULL,
    [Email]              NVARCHAR (320) NOT NULL,
    [Password]           NVARCHAR (200) NOT NULL,
    [PhoneNumber]        NVARCHAR (15)  NULL,
    [Role]               TINYINT        NOT NULL,
    [Deleted]            BIT            NOT NULL,
    [IsVerified]         BIT            NOT NULL,
    [DeletedAt]          DATETIME2 (7)  NULL,
    [CreatedAt]          DATETIME2 (7)  NOT NULL,
    [ResetPasswordToken] NVARCHAR (100) NULL,
    [RegisterToken]      NVARCHAR (100) NULL,
    CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED ([IdUser] ASC)
);











