import bcrypt from 'bcrypt';

export const hash = (text:string) => {
	const salt = bcrypt.genSaltSync();
	return bcrypt.hashSync(text, salt);
};

export const verifyHash = (source: string, secret: string) => {
	return bcrypt.compareSync(source, secret);
};