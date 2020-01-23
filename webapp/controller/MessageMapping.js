sap.ui.define(function() {
	"use strict";
	
	var MessageMapping = {
		
		/*
		0. Incorrect User Name or password.
		1. User Registration Failed.
		2. User Name is already taken please choose some other username.
		3. Booking failed due to : you have already exhausted your daily booking limit.
		4. Booking failed due to : pool table is already booked by some other player.
		5. Your session has expired.
		6. Match booking failed due to : you have already exhausted your daily booking limit.
		*/
		oErrorMessage : [
			{
					type: 'Error',
					title: 'Incorrect Credentials',
					description: 'You have entered incorrect user name or password \n' +
					'Click on forgot password for changing the password.',
					subtitle: '',
					counter: 1
			},
			{
					type: 'Error',
					title: 'User Registration failed',
					description: 'Try Using a valid mail ID. ',
					subtitle: '',
					counter: 1
			},
			{
					type: 'Error',
					title: 'User name already taken',
					description: 'The given user name is already taken \n' +
					'Try using user name followed by a number.',
					subtitle: '',
					counter: 1
			},
			{
					type: 'Error',
					title: 'Booking Failed',
					description: 'Booking Failed Due to : \n' +
					'You have already exhausted your daily booking limit.',
					subtitle: '',
					counter: 1
			},
			{
					type: 'Error',
					title: 'Booking Failed',
					description: 'Booking Failed Due to : \n' +
					'Pool table is already booked by some other player.',
					subtitle: '',
					counter: 1
			},
			{
					type: 'Error',
					title: 'Session Expired',
					subtitle: '',
					counter: 1
			},
			{
					type: 'Error',
					title: 'Match Booking Failed',
					description: 'Match Booking Failed Due to : \n' +
					'you have already exhausted your daily booking limit.',
					subtitle: '',
					counter: 1
			}
	
		],
		
		/*
		0. User registered successfully.
		1. Pool table booked Successfully.
		2. Match created and Pool table booked successfully.
		*/
		oSuccessMessage : [
			{
				type: sap.ui.core.MessageType.Success,
				title: 'User Registered Successfully',
				description: 'You can now login with the registered credentials',
				subtitle: '',
				counter: 1
			},
			{
				type: 'Success',
				title: 'Pool Table Booked Successfully',
				subtitle: '',
				counter: 1
			},
			{
				type: 'Success',
				title: 'Match Created Successfully',
				subtitle: '',
				counter: 1
			},
			{
				type: 'Success',
				title: 'Mail Sent To Individual Players Successfully',
				subtitle: '',
				counter: 1
			}
		]
		
	};
	return MessageMapping;
});