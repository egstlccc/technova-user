module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    token: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    expiresAt: { 
      type: DataTypes.DATE, 
      allowNull: false 
    },
    used: { 
      type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: false 
    }
  }, {
    tableName: 'password_reset_tokens',
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['token']
      },
      {
        fields: ['email']
      },
      {
        fields: ['expiresAt']
      }
    ]
  });

  return PasswordResetToken;
};