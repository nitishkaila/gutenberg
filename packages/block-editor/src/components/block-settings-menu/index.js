/**
 * External dependencies
 */
import classnames from 'classnames';
import { castArray, flow } from 'lodash';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Toolbar, Dropdown, NavigableMenu, MenuItem } from '@wordpress/components';
import { withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { shortcuts } from '../block-editor-keyboard-shortcuts';
import BlockActions from '../block-actions';
import BlockModeToggle from './block-mode-toggle';
import BlockHTMLConvertButton from './block-html-convert-button';
import BlockUnknownConvertButton from './block-unknown-convert-button';
import __experimentalBlockSettingsMenuFirstItem from './block-settings-menu-first-item';
import __experimentalBlockSettingsMenuPluginsExtension from './block-settings-menu-plugins-extension';

export function BlockSettingsMenu( { clientIds, onSelect } ) {
	const blockClientIds = castArray( clientIds );
	const count = blockClientIds.length;
	const firstBlockClientId = blockClientIds[ 0 ];

	return (
		<BlockActions clientIds={ clientIds }>
			{ ( { onDuplicate, onRemove, onInsertAfter, onInsertBefore, canDuplicate, isLocked } ) => (
				<Dropdown
					contentClassName="editor-block-settings-menu__popover block-editor-block-settings-menu__popover"
					position="bottom right"
					renderToggle={ ( { onToggle, isOpen } ) => {
						const toggleClassname = classnames( 'editor-block-settings-menu__toggle block-editor-block-settings-menu__toggle', {
							'is-opened': isOpen,
						} );
						const label = isOpen ? __( 'Hide options' ) : __( 'More options' );

						return (
							<Toolbar controls={ [ {
								icon: 'ellipsis',
								title: label,
								onClick: () => {
									if ( count === 1 ) {
										onSelect( firstBlockClientId );
									}
									onToggle();
								},
								className: toggleClassname,
								extraProps: { 'aria-expanded': isOpen },
							} ] } />
						);
					} }
					renderContent={ ( { onClose } ) => (
						<NavigableMenu className="editor-block-settings-menu__content block-editor-block-settings-menu__content">
							<__experimentalBlockSettingsMenuFirstItem.Slot fillProps={ { onClose } } />
							{ count === 1 && (
								<BlockUnknownConvertButton
									clientId={ firstBlockClientId }
								/>
							) }
							{ count === 1 && (
								<BlockHTMLConvertButton
									clientId={ firstBlockClientId }
								/>
							) }
							{ ! isLocked && canDuplicate && (
								<MenuItem
									className="editor-block-settings-menu__control block-editor-block-settings-menu__control"
									onClick={ flow( onClose, onDuplicate ) }
									icon="admin-page"
									shortcut={ shortcuts.duplicate.display }
								>
									{ __( 'Duplicate' ) }
								</MenuItem>
							) }
							{ ! isLocked && (
								<>
									<MenuItem
										className="editor-block-settings-menu__control block-editor-block-settings-menu__control"
										onClick={ flow( onClose, onInsertBefore ) }
										icon="insert-before"
										shortcut={ shortcuts.insertBefore.display }
									>
										{ __( 'Insert Before' ) }
									</MenuItem>
									<MenuItem
										className="editor-block-settings-menu__control block-editor-block-settings-menu__control"
										onClick={ flow( onClose, onInsertAfter ) }
										icon="insert-after"
										shortcut={ shortcuts.insertAfter.display }
									>
										{ __( 'Insert After' ) }
									</MenuItem>
								</>
							) }
							{ count === 1 && (
								<BlockModeToggle
									clientId={ firstBlockClientId }
									onToggle={ onClose }
								/>
							) }
							<__experimentalBlockSettingsMenuPluginsExtension.Slot fillProps={ { clientIds, onClose } } />
							<div className="editor-block-settings-menu__separator block-editor-block-settings-menu__separator" />
							{ ! isLocked && (
								<MenuItem
									className="editor-block-settings-menu__control block-editor-block-settings-menu__control"
									onClick={ flow( onClose, onRemove ) }
									icon="trash"
									shortcut={ shortcuts.removeBlock.display }
								>
									{ __( 'Remove Block' ) }
								</MenuItem>
							) }
						</NavigableMenu>
					) }
				/>
			) }
		</BlockActions>
	);
}

export default withDispatch( ( dispatch ) => {
	const { selectBlock } = dispatch( 'core/block-editor' );

	return {
		onSelect( clientId ) {
			selectBlock( clientId );
		},
	};
} )( BlockSettingsMenu );
