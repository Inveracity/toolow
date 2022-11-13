import { Box, Image } from "@chakra-ui/react"
import banner from "../assets/banner.png"

const Banner = () => {
  return (
    <Box display="flex" bg="brand.bg" justifyContent="center">
      <Image src={banner} height="50px" mt="15px" />
    </Box>
  )
}

export default Banner;
