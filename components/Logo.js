import React from "react";
import {Image, Box, Text, SimpleGrid} from "@chakra-ui/react";

export default function Logo(props) {
    return (
        <Box {...props}>
            <SimpleGrid columns={2}>
                <Image src={'icon.png'} boxSize={"50px"}/>
            <Text fontSize="lg" fontWeight="bold">
                Guess the Word
            </Text>
            </SimpleGrid>
        </Box>
    );
}