import { TextControl, Flex, FlexBlock, FlexItem, Button, Icon, PanelBody, PanelRow, ColorPicker } from '@wordpress/components';
import {InspectorControls, BlockControls, AlignmentToolbar, useBlockProps} from '@wordpress/block-editor';
import './index.scss';

const blockName = 'my-blocks/quiz';

(function() {
    let lockedButton = false;

    wp.data.subscribe(function () {
        const items = wp.data.select('core/block-editor').getBlocks().filter(function (block) {
            return block.name === blockName && block.attributes.correctAnswer === undefined;
        });

        if (!lockedButton && items.length > 0) {
            lockedButton = true;
            wp.data.dispatch('core/editor').lockPostSaving('no-answer');
        }

        if (lockedButton && items.length === 0) {
            lockedButton = false;
            wp.data.dispatch('core/editor').unlockPostSaving('no-answer');
        }
    });
})();

wp.blocks.registerBlockType(blockName, {
    title: 'Quiz Block',
    icon: 'smiley',
    category: 'common',
    attributes: {
        question: {
            type: 'string'
        },
        answers: {
            type: 'array',
            default: []
        },
        correctAnswer: {
            type: 'number',
            default: undefined
        },
        backgroundColor: {
            type: 'string',
            default: '#eeeeee'
        },
        alignment: {
            type: 'string',
            default: 'left'
        }
    },
    example: {
        attributes: {
            question: 'What is the capital of France?',
            answers: ['London', 'Paris', 'Berlin', 'Madrid'],
            correctAnswer: 1,
            backgroundColor: '#eeeeee',
            alignment: 'left'
        }
    },
    edit: EditComponent,
    save: SaveComponent
});

function EditComponent(props) {
    const blockProps = useBlockProps({
        className: "quiz-edit-block",
        style: {
            backgroundColor: props.attributes.backgroundColor
        }
    });
    function updateQuestion(value) {
        props.setAttributes({
            question: value
        });
    }
    function deleteAnswer(index) {
        const answers = [...props.attributes.answers];
        answers.splice(index, 1);
        props.setAttributes({
            answers
        });

        if (props.attributes.correctAnswer === index) {
            props.setAttributes({
                correctAnswer: undefined
            });
        }
    }
    function setCorrectAnswer(index) {
        props.setAttributes({
            correctAnswer: index
        });
    }

    return (
        <div {...blockProps}>
            <BlockControls>
                <AlignmentToolbar
                    value={props.attributes.alignment}
                    onChange={alignment => props.setAttributes({ alignment })}
                />
            </BlockControls>
            <InspectorControls>
                <PanelBody title="Background Color" initialOpen={true}>
                    <PanelRow>
                        <ColorPicker color={props.attributes.backgroundColor} onChangeComplete={e => props.setAttributes({ backgroundColor: e.hex }) } />
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            <TextControl label="Question:" value={props.attributes.question} onChange={updateQuestion} />
            <p>
                Answers:
            </p>
            {props.attributes.answers.map((answer, index) => {
                return (
                    <Flex>
                        <FlexBlock>
                            <TextControl
                                value={answer}
                                onChange={ value => {
                                    const answers = [...props.attributes.answers];
                                    answers[index] = value;
                                    props.setAttributes({
                                        answers
                                    });
                                }}
                            />
                        </FlexBlock>
                        <FlexItem>
                            <Button
                                onClick={() => setCorrectAnswer(index)} >
                                <Icon
                                    className="mark-as-correct"
                                    icon={props.attributes.correctAnswer === index ? 'star-filled' : 'star-empty'}
                                />
                            </Button>
                        </FlexItem>
                        <FlexItem>
                            <Button
                                onClick={() => deleteAnswer(index)} >
                                <Icon
                                    className="attention-delete"
                                    icon="trash" />
                            </Button>
                        </FlexItem>
                    </Flex>
                );
            })}
            <Button isPrimary onClick={ () => {
                const answers = [...props.attributes.answers];
                answers.push('');
                props.setAttributes({
                    answers
                });
            }}>
                Add New Answer
            </Button>
        </div>
    );
}

function SaveComponent() {
    return null;
}