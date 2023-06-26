export default async (time) => {
	return await new Promise((resolve) => setTimeout(resolve, time))
}
