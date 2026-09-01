import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View,
} from "react-native";


/* -----theme----- */

const DARK = {
    background: "#111111",
    surface: "#181818",
    surface2: "#202020",
    surface3: "#292929",
    text: "#F2F2F2",
    textSoft: "#999999",
    textFaint: "#666666",
    border: "#292929",
    borderStrong: "#383838",
    cube: "#050505",
    cubeLine: "#EEEEEE",
};

const LIGHT = {
    background: "#F5F5F3",
    surface: "#FFFFFF",
    surface2: "#EEEEEC",
    surface3: "#E5E5E2",
    text: "#161616",
    textSoft: "#676767",
    textFaint: "#999999",
    border: "#DDDDDA",
    borderStrong: "#C9C9C5",
    cube: "#111111",
    cubeLine: "#F2F2F2",
};


/* -----cube----- */

function RubixCube({
    theme,
    size = 21,
    open = false,
    spinning = false,
}) {

    const rotation = useRef(
        new Animated.Value(0)
    ).current;

    useEffect(() => {

        if (!spinning) {
            rotation.stopAnimation();

            Animated.spring(rotation, {
                toValue: open ? 1 : 0,
                friction: 8,
                tension: 70,
                useNativeDriver: true,
            }).start();

            return;
        }

        rotation.setValue(0);

        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1800,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: true,
            })
        ).start();

    }, [open, spinning]);


    const rotateY = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: open
            ? ["34deg", "120deg"]
            : ["34deg", "394deg"],
    });


    const rotateX = open
        ? "-24deg"
        : "-28deg";


    return (
        <Animated.View
            style={[
                styles.cube,
                {
                    width: size,
                    height: size,
                    transform: [
                        { perspective: 500 },
                        { rotateX },
                        { rotateY },
                    ],
                },
            ]}
        >

            <CubeFace
                theme={theme}
                size={size}
                transform={[
                    { translateZ: size / 2 },
                ]}
            />

            <CubeFace
                theme={theme}
                size={size}
                transform={[
                    { rotateY: "180deg" },
                    { translateZ: size / 2 },
                ]}
            />

            <CubeFace
                theme={theme}
                size={size}
                transform={[
                    { rotateY: "90deg" },
                    { translateZ: size / 2 },
                ]}
            />

            <CubeFace
                theme={theme}
                size={size}
                transform={[
                    { rotateY: "-90deg" },
                    { translateZ: size / 2 },
                ]}
            />

            <CubeFace
                theme={theme}
                size={size}
                transform={[
                    { rotateX: "90deg" },
                    { translateZ: size / 2 },
                ]}
            />

            <CubeFace
                theme={theme}
                size={size}
                transform={[
                    { rotateX: "-90deg" },
                    { translateZ: size / 2 },
                ]}
            />

        </Animated.View>
    );
}


function CubeFace({
    theme,
    size,
    transform,
}) {

    return (
        <View
            style={[
                styles.cubeFace,
                {
                    width: size,
                    height: size,
                    backgroundColor: theme.cube,
                    borderColor: theme.cubeLine,
                    transform,
                },
            ]}
        >

            <View
                style={[
                    styles.cubeVertical,
                    {
                        backgroundColor: theme.cubeLine,
                    },
                ]}
            />

            <View
                style={[
                    styles.cubeHorizontal,
                    {
                        backgroundColor: theme.cubeLine,
                    },
                ]}
            />

        </View>
    );
}


/* -----app----- */

export default function App() {

    const systemScheme = useColorScheme();

    const theme =
        systemScheme === "dark"
            ? DARK
            : LIGHT;


    const [historyOpen, setHistoryOpen] =
        useState(false);

    const [modelOpen, setModelOpen] =
        useState(false);

    const [pinOpen, setPinOpen] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [thinking, setThinking] =
        useState(false);

    const [model, setModel] =
        useState("Rubix 1.2");


    const scrollRef =
        useRef(null);


    const sendMessage = () => {

        const cleanMessage =
            message.trim();

        if (
            !cleanMessage ||
            thinking
        ) {
            return;
        }


        setMessages((previous) => [
            ...previous,
            {
                id:
                    Date.now(),
                role:
                    "user",
                text:
                    cleanMessage,
            },
        ]);


        setMessage("");

        setThinking(true);


        setTimeout(() => {

            setThinking(false);

            setMessages((previous) => [
                ...previous,
                {
                    id:
                        Date.now() + 1,
                    role:
                        "assistant",
                    text:
                        "Hello there, I'm Rubix.",
                },
            ]);

        }, 1450);

    };


    const newChat = () => {

        setMessages([]);

        setMessage("");

        setThinking(false);

        setHistoryOpen(false);

        setPinOpen(false);

    };


    useEffect(() => {

        setTimeout(() => {

            scrollRef.current?.scrollToEnd({
                animated: true,
            });

        }, 50);

    }, [messages, thinking]);


    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                {
                    backgroundColor:
                        theme.background,
                },
            ]}
        >

            <KeyboardAvoidingView
                style={styles.app}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >

                {/* -----header----- */}

                <View
                    style={[
                        styles.header,
                        {
                            borderBottomColor:
                                theme.border,
                        },
                    ]}
                >

                    <View
                        style={
                            styles.headerLeft
                        }
                    >

                        <Pressable
                            onPress={() => {

                                setHistoryOpen(
                                    !historyOpen
                                );

                                setModelOpen(
                                    false
                                );

                                setPinOpen(
                                    false
                                );

                            }}
                            style={({ pressed }) => [
                                styles.cubeButton,
                                {
                                    opacity:
                                        pressed
                                            ? 0.65
                                            : 1,
                                },
                            ]}
                        >

                            <RubixCube
                                theme={theme}
                                size={21}
                                open={
                                    historyOpen
                                }
                            />

                        </Pressable>


                        <Pressable
                            onPress={newChat}
                            style={({ pressed }) => [
                                styles.newChat,
                                {
                                    backgroundColor:
                                        pressed
                                            ? theme.surface2
                                            : "transparent",
                                },
                            ]}
                        >

                            <View
                                style={
                                    styles.newChatDots
                                }
                            >

                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor:
                                                theme.textSoft,
                                        },
                                    ]}
                                />

                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor:
                                                theme.textSoft,
                                        },
                                    ]}
                                />

                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor:
                                                theme.textSoft,
                                        },
                                    ]}
                                />

                            </View>


                            <Text
                                style={[
                                    styles.newChatText,
                                    {
                                        color:
                                            theme.textSoft,
                                    },
                                ]}
                            >
                                New chat
                            </Text>

                        </Pressable>

                    </View>


                    {/* -----model selector----- */}

                    <View>

                        <Pressable
                            onPress={() => {

                                setModelOpen(
                                    !modelOpen
                                );

                                setPinOpen(
                                    false
                                );

                            }}
                            style={[
                                styles.modelButton,
                                {
                                    backgroundColor:
                                        modelOpen
                                            ? theme.surface2
                                            : "transparent",
                                },
                            ]}
                        >

                            <Text
                                style={[
                                    styles.modelButtonText,
                                    {
                                        color:
                                            theme.text,
                                    },
                                ]}
                            >
                                {model}
                            </Text>


                            <Text
                                style={[
                                    styles.modelArrow,
                                    {
                                        color:
                                            theme.textSoft,
                                    },
                                ]}
                            >
                                {modelOpen
                                    ? "⌃"
                                    : "⌄"}
                            </Text>

                        </Pressable>


                        {modelOpen && (

                            <View
                                style={[
                                    styles.modelMenu,
                                    {
                                        backgroundColor:
                                            theme.surface,
                                        borderColor:
                                            theme.border,
                                        shadowColor:
                                            "#000",
                                    },
                                ]}
                            >

                                <ModelOption
                                    theme={theme}
                                    name="Rubix 1.2"
                                    description="Base Version"
                                    selected={
                                        model ===
                                        "Rubix 1.2"
                                    }
                                    onPress={() => {

                                        setModel(
                                            "Rubix 1.2"
                                        );

                                        setModelOpen(
                                            false
                                        );

                                    }}
                                />


                                <ModelOption
                                    theme={theme}
                                    name="Rubix Deep Thinking"
                                    description="Deep search & extended reasoning"
                                    selected={
                                        model ===
                                        "Rubix Deep Thinking"
                                    }
                                    onPress={() => {

                                        setModel(
                                            "Rubix Deep Thinking"
                                        );

                                        setModelOpen(
                                            false
                                        );

                                    }}
                                />


                                <ModelOption
                                    theme={theme}
                                    name="Rubix Pro"
                                    description="Rubixing Logic"
                                    selected={
                                        model ===
                                        "Rubix Pro"
                                    }
                                    onPress={() => {

                                        setModel(
                                            "Rubix Pro"
                                        );

                                        setModelOpen(
                                            false
                                        );

                                    }}
                                />

                            </View>

                        )}

                    </View>

                </View>


                {/* -----conversation----- */}

                <View
                    style={
                        styles.conversation
                    }
                >

                    <ScrollView
                        ref={scrollRef}
                        style={styles.scroll}
                        contentContainerStyle={[
                            styles.conversationContent,
                            messages.length === 0 &&
                                !thinking &&
                                styles.emptyConversation,
                        ]}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >

                        {messages.length === 0 &&
                            !thinking && (

                                <View
                                    style={
                                        styles.welcome
                                    }
                                >

                                    <View
                                        style={
                                            styles.welcomeCube
                                        }
                                    >

                                        <RubixCube
                                            theme={theme}
                                            size={28}
                                        />

                                    </View>


                                    <Text
                                        style={[
                                            styles.welcomeTitle,
                                            {
                                                color:
                                                    theme.text,
                                            },
                                        ]}
                                    >
                                        Talk to Rubix
                                    </Text>


                                    <Text
                                        style={[
                                            styles.welcomeSubtitle,
                                            {
                                                color:
                                                    theme.textSoft,
                                            },
                                        ]}
                                    >
                                        Think with it. Build with it.
                                        {" "}Rubix will figure out the rest.
                                    </Text>

                                </View>

                            )}


                        {messages.map((item) => (

                            <Message
                                key={item.id}
                                item={item}
                                theme={theme}
                            />

                        ))}


                        {thinking && (

                            <View
                                style={
                                    styles.thinking
                                }
                            >

                                <RubixCube
                                    theme={theme}
                                    size={21}
                                    spinning
                                />


                                <ShimmerText
                                    theme={theme}
                                />

                            </View>

                        )}

                    </ScrollView>

                </View>


                {/* -----composer----- */}

                <View
                    style={[
                        styles.composerArea,
                        {
                            backgroundColor:
                                theme.background,
                        },
                    ]}
                >

                    <View
                        style={
                            styles.composerWrapper
                        }
                    >

                        {pinOpen && (

                            <View
                                style={[
                                    styles.pinMenu,
                                    {
                                        backgroundColor:
                                            theme.surface,
                                        borderColor:
                                            theme.border,
                                    },
                                ]}
                            >

                                <PinOption
                                    theme={theme}
                                    icon="↑"
                                    title="Upload file"
                                    subtitle="Add something for Rubix to read"
                                />

                                <PinOption
                                    theme={theme}
                                    icon="◇"
                                    title="Add image"
                                    subtitle="Give Rubix something visual"
                                />

                                <PinOption
                                    theme={theme}
                                    icon="#"
                                    title="Add context"
                                    subtitle="Attach additional information"
                                />

                            </View>

                        )}


                        <View
                            style={[
                                styles.composer,
                                {
                                    backgroundColor:
                                        theme.surface,
                                    borderColor:
                                        theme.borderStrong,
                                },
                            ]}
                        >

                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Talk to Rubix..."
                                placeholderTextColor={
                                    theme.textFaint
                                }
                                multiline
                                maxLength={10000}
                                style={[
                                    styles.input,
                                    {
                                        color:
                                            theme.text,
                                    },
                                ]}
                                returnKeyType="send"
                                blurOnSubmit={false}
                                onSubmitEditing={() => {

                                    if (
                                        Platform.OS !==
                                        "ios"
                                    ) {
                                        sendMessage();
                                    }

                                }}
                            />


                            <View
                                style={
                                    styles.composerActions
                                }
                            >

                                {/* -----pin----- */}

                                <Pressable
                                    onPress={() => {

                                        setPinOpen(
                                            !pinOpen
                                        );

                                        setModelOpen(
                                            false
                                        );

                                    }}
                                    style={[
                                        styles.actionButton,
                                        {
                                            backgroundColor:
                                                pinOpen
                                                    ? theme.surface2
                                                    : "transparent",
                                        },
                                    ]}
                                >

                                    <View
                                        style={[
                                            styles.pinIcon,
                                            {
                                                borderColor:
                                                    theme.textSoft,
                                            },
                                        ]}
                                    />

                                </Pressable>


                                {/* -----mic----- */}

                                <Pressable
                                    onPress={() => {}}
                                    style={
                                        styles.actionButton
                                    }
                                >

                                    <View
                                        style={[
                                            styles.micIcon,
                                            {
                                                borderColor:
                                                    theme.textSoft,
                                            },
                                        ]}
                                    />

                                </Pressable>


                                {/* -----send----- */}

                                <Pressable
                                    onPress={sendMessage}
                                    disabled={
                                        !message.trim() ||
                                        thinking
                                    }
                                    style={[
                                        styles.sendButton,
                                        {
                                            backgroundColor:
                                                theme.text,
                                            opacity:
                                                !message.trim() ||
                                                thinking
                                                    ? 0.3
                                                    : 1,
                                        },
                                    ]}
                                >

                                    <Text
                                        style={[
                                            styles.sendArrow,
                                            {
                                                color:
                                                    theme.background,
                                            },
                                        ]}
                                    >
                                        ↑
                                    </Text>

                                </Pressable>

                            </View>

                        </View>


                        <Text
                            style={[
                                styles.composerNote,
                                {
                                    color:
                                        theme.textFaint,
                                },
                            ]}
                        >
                            Rubix can make mistakes. Check important information.
                        </Text>

                    </View>

                </View>


                {/* -----history----- */}

                {historyOpen && (

                    <View
                        style={
                            StyleSheet.absoluteFill
                        }
                        pointerEvents="box-none"
                    >

                        <Pressable
                            onPress={() =>
                                setHistoryOpen(false)
                            }
                            style={
                                styles.historyBackdrop
                            }
                        />


                        <View
                            style={[
                                styles.historyPanel,
                                {
                                    backgroundColor:
                                        theme.surface,
                                    borderColor:
                                        theme.border,
                                    shadowColor:
                                        "#000",
                                },
                            ]}
                        >

                            <View
                                style={
                                    styles.historyHeader
                                }
                            >

                                <Text
                                    style={[
                                        styles.historyTitle,
                                        {
                                            color:
                                                theme.text,
                                        },
                                    ]}
                                >
                                    Conversations
                                </Text>


                                <Pressable
                                    onPress={() =>
                                        setHistoryOpen(
                                            false
                                        )
                                    }
                                    style={
                                        styles.historyClose
                                    }
                                >

                                    <Text
                                        style={[
                                            styles.closeText,
                                            {
                                                color:
                                                    theme.textSoft,
                                            },
                                        ]}
                                    >
                                        ×
                                    </Text>

                                </Pressable>

                            </View>


                            <ScrollView
                                showsVerticalScrollIndicator={
                                    false
                                }
                            >

                                <HistoryItem
                                    theme={theme}
                                    title="Welcome to Rubix"
                                    time="Just now"
                                />

                                <HistoryItem
                                    theme={theme}
                                    title="Exploring an idea"
                                    time="Earlier"
                                />

                                <HistoryItem
                                    theme={theme}
                                    title="Project discussion"
                                    time="Earlier"
                                />

                            </ScrollView>

                        </View>

                    </View>

                )}

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}


/* -----model option----- */

function ModelOption({
    theme,
    name,
    description,
    selected,
    onPress,
}) {

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.modelOption,
                {
                    backgroundColor:
                        selected
                            ? theme.surface2
                            : "transparent",
                },
            ]}
        >

            <Text
                style={[
                    styles.modelName,
                    {
                        color:
                            theme.text,
                    },
                ]}
            >
                {name}
            </Text>


            <Text
                style={[
                    styles.modelDescription,
                    {
                        color:
                            theme.textSoft,
                    },
                ]}
            >
                {description}
            </Text>

        </Pressable>
    );
}


/* -----message----- */

function Message({
    item,
    theme,
}) {

    if (item.role === "user") {

        return (
            <View
                style={
                    styles.userMessageRow
                }
            >

                <View
                    style={[
                        styles.userMessage,
                        {
                            backgroundColor:
                                theme.surface2,
                        },
                    ]}
                >

                    <Text
                        style={[
                            styles.messageText,
                            {
                                color:
                                    theme.text,
                            },
                        ]}
                    >
                        {item.text}
                    </Text>

                </View>

            </View>
        );
    }


    return (
        <View
            style={
                styles.aiMessageRow
            }
        >

            <View
                style={
                    styles.aiCube
                }
            >

                <RubixCube
                    theme={theme}
                    size={21}
                />

            </View>


            <Text
                style={[
                    styles.messageText,
                    styles.aiText,
                    {
                        color:
                            theme.text,
                    },
                ]}
            >
                {item.text}
            </Text>

        </View>
    );
}


/* -----shimmer----- */

function ShimmerText({
    theme,
}) {

    const shimmer =
        useRef(
            new Animated.Value(-80)
        ).current;


    useEffect(() => {

        Animated.loop(
            Animated.timing(shimmer, {
                toValue: 140,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

    }, []);


    return (
        <View
            style={
                styles.shimmerContainer
            }
        >

            <Text
                style={[
                    styles.thinkingText,
                    {
                        color:
                            theme.textSoft,
                    },
                ]}
            >
                rubixing...
            </Text>


            <Animated.View
                pointerEvents="none"
                style={[
                    styles.shimmerLine,
                    {
                        transform: [
                            {
                                translateX:
                                    shimmer,
                            },
                            {
                                skewX:
                                    "-20deg",
                            },
                        ],
                    },
                ]}
            />

        </View>
    );
}


/* -----pin option----- */

function PinOption({
    theme,
    icon,
    title,
    subtitle,
}) {

    return (
        <Pressable
            style={({ pressed }) => [
                styles.pinOption,
                {
                    backgroundColor:
                        pressed
                            ? theme.surface2
                            : "transparent",
                },
            ]}
        >

            <View
                style={[
                    styles.pinOptionIcon,
                    {
                        backgroundColor:
                            theme.surface2,
                    },
                ]}
            >

                <Text
                    style={[
                        styles.pinOptionIconText,
                        {
                            color:
                                theme.text,
                        },
                    ]}
                >
                    {icon}
                </Text>

            </View>


            <View
                style={
                    styles.pinOptionText
                }
            >

                <Text
                    style={[
                        styles.pinOptionTitle,
                        {
                            color:
                                theme.text,
                        },
                    ]}
                >
                    {title}
                </Text>


                <Text
                    style={[
                        styles.pinOptionSubtitle,
                        {
                            color:
                                theme.textFaint,
                        },
                    ]}
                >
                    {subtitle}
                </Text>

            </View>

        </Pressable>
    );
}


/* -----history item----- */

function HistoryItem({
    theme,
    title,
    time,
}) {

    return (
        <Pressable
            style={({ pressed }) => [
                styles.historyItem,
                {
                    backgroundColor:
                        pressed
                            ? theme.surface2
                            : "transparent",
                },
            ]}
        >

            <Text
                numberOfLines={1}
                style={[
                    styles.historyItemTitle,
                    {
                        color:
                            theme.text,
                    },
                ]}
            >
                {title}
            </Text>


            <Text
                style={[
                    styles.historyItemTime,
                    {
                        color:
                            theme.textFaint,
                    },
                ]}
            >
                {time}
            </Text>

        </Pressable>
    );
}


/* -----styles----- */

const styles = StyleSheet.create({

    safeArea: {
        flex: 1,
    },

    app: {
        flex: 1,
    },


    /* -----header----- */

    header: {
        height: 68,
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 20,
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    cubeButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 11,
    },

    newChat: {
        height: 38,
        paddingHorizontal: 10,
        borderRadius: 11,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    newChatDots: {
        flexDirection: "row",
        gap: 3,
    },

    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
    },

    newChatText: {
        fontSize: 13,
        fontWeight: "600",
    },


    /* -----model----- */

    modelButton: {
        minHeight: 38,
        paddingHorizontal: 10,
        borderRadius: 11,
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    modelButtonText: {
        fontSize: 13,
        fontWeight: "700",
    },

    modelArrow: {
        fontSize: 15,
        marginTop: -3,
    },

    modelMenu: {
        position: "absolute",
        top: 45,
        right: 0,
        width: 255,
        padding: 7,
        borderWidth: 1,
        borderRadius: 15,
        elevation: 12,
        shadowOpacity: 0.22,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 10,
        },
    },

    modelOption: {
        paddingHorizontal: 12,
        paddingVertical: 11,
        borderRadius: 10,
    },

    modelName: {
        fontSize: 13,
        fontWeight: "700",
    },

    modelDescription: {
        marginTop: 3,
        fontSize: 11,
        lineHeight: 15,
    },


    /* -----cube----- */

    cube: {
        position: "relative",
        transformStyle: "preserve-3d",
    },

    cubeFace: {
        position: "absolute",
        left: 0,
        top: 0,
        borderWidth: 1,
        overflow: "hidden",
        backfaceVisibility: "visible",
    },

    cubeVertical: {
        position: "absolute",
        width: 1,
        height: "100%",
        left: "50%",
        top: 0,
        opacity: 0.9,
    },

    cubeHorizontal: {
        position: "absolute",
        width: "100%",
        height: 1,
        left: 0,
        top: "50%",
        opacity: 0.9,
    },


    /* -----conversation----- */

    conversation: {
        flex: 1,
    },

    scroll: {
        flex: 1,
    },

    conversationContent: {
        flexGrow: 1,
        width: "100%",
        maxWidth: 960,
        alignSelf: "center",
        paddingHorizontal: 16,
        paddingTop: 28,
        paddingBottom: 30,
    },

    emptyConversation: {
        justifyContent: "center",
    },


    /* -----welcome----- */

    welcome: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    welcomeCube: {
        width: 42,
        height: 42,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 18,
    },

    welcomeTitle: {
        fontSize: 27,
        lineHeight: 31,
        fontWeight: "800",
        letterSpacing: -1,
    },

    welcomeSubtitle: {
        marginTop: 9,
        maxWidth: 390,
        textAlign: "center",
        fontSize: 13,
        lineHeight: 19,
    },


    /* -----messages----- */

    userMessageRow: {
        width: "100%",
        alignItems: "flex-end",
        marginBottom: 20,
    },

    userMessage: {
        maxWidth: "88%",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 15,
        borderBottomRightRadius: 4,
    },

    aiMessageRow: {
        width: "100%",
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 20,
        gap: 12,
    },

    aiCube: {
        width: 21,
        height: 21,
        marginTop: 2,
        alignItems: "center",
        justifyContent: "center",
    },

    messageText: {
        fontSize: 14,
        lineHeight: 22,
    },

    aiText: {
        flex: 1,
        paddingRight: 12,
    },


    /* -----thinking----- */

    thinking: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 26,
        marginBottom: 20,
        paddingLeft: 1,
    },

    shimmerContainer: {
        height: 22,
        overflow: "hidden",
        justifyContent: "center",
    },

    thinkingText: {
        fontSize: 12,
        fontWeight: "700",
        fontStyle: "italic",
    },

    shimmerLine: {
        position: "absolute",
        left: -40,
        top: -8,
        width: 28,
        height: 40,
        backgroundColor: "rgba(255,255,255,0.25)",
    },


    /* -----composer----- */

    composerArea: {
        width: "100%",
        paddingHorizontal: 10,
        paddingBottom: Platform.OS === "ios"
            ? 10
            : 12,
        zIndex: 20,
    },

    composerWrapper: {
        width: "100%",
        maxWidth: 960,
        alignSelf: "center",
        position: "relative",
    },

    composer: {
        minHeight: 58,
        width: "100%",
        borderWidth: 1,
        borderRadius: 18,
        padding: 7,
        flexDirection: "row",
        alignItems: "flex-end",
    },

    input: {
        flex: 1,
        minHeight: 42,
        maxHeight: 150,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 14,
        lineHeight: 20,
    },

    composerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
    },

    actionButton: {
        width: 39,
        height: 39,
        borderRadius: 11,
        alignItems: "center",
        justifyContent: "center",
    },


    /* -----pin icon----- */

    pinIcon: {
        width: 16,
        height: 16,
        borderWidth: 1.5,
        borderRadius: 4,
        transform: [
            {
                rotate: "-45deg",
            },
        ],
    },


    /* -----mic icon----- */

    micIcon: {
        width: 13,
        height: 18,
        borderWidth: 1.5,
        borderRadius: 8,
        position: "relative",
    },


    /* -----send----- */

    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },

    sendArrow: {
        fontSize: 20,
        fontWeight: "500",
        marginTop: -3,
    },

    composerNote: {
        textAlign: "center",
        paddingTop: 8,
        fontSize: 10,
    },


    /* -----pin menu----- */

    pinMenu: {
        position: "absolute",
        left: 0,
        bottom: 66,
        width: 225,
        padding: 7,
        borderWidth: 1,
        borderRadius: 15,
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 20,
        shadowOffset: {
            width: 0,
            height: 8,
        },
        zIndex: 30,
    },

    pinOption: {
        width: "100%",
        padding: 10,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
    },

    pinOptionIcon: {
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    pinOptionIconText: {
        fontSize: 12,
        fontWeight: "700",
    },

    pinOptionText: {
        flex: 1,
    },

    pinOptionTitle: {
        fontSize: 12,
        fontWeight: "700",
    },

    pinOptionSubtitle: {
        marginTop: 2,
        fontSize: 10,
        lineHeight: 14,
    },


    /* -----history----- */

    historyBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.08)",
    },

    historyPanel: {
        position: "absolute",
        top: Platform.OS === "ios"
            ? 68
            : 18,
        left: 10,
        bottom: 10,
        width: 330,
        maxWidth: "calc(100% - 20px)",
        borderWidth: 1,
        borderRadius: 18,
        padding: 15,
        elevation: 15,
        shadowOpacity: 0.25,
        shadowRadius: 25,
        shadowOffset: {
            width: 0,
            height: 10,
        },
    },

    historyHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 3,
        paddingBottom: 13,
    },

    historyTitle: {
        fontSize: 13,
        fontWeight: "800",
    },

    historyClose: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9,
    },

    closeText: {
        fontSize: 24,
        fontWeight: "300",
        lineHeight: 25,
    },

    historyItem: {
        paddingHorizontal: 10,
        paddingVertical: 11,
        borderRadius: 10,
        marginBottom: 2,
    },

    historyItemTitle: {
        fontSize: 12,
        fontWeight: "700",
    },

    historyItemTime: {
        marginTop: 3,
        fontSize: 10,
    },

});
